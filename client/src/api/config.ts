import { execOnHost, isWindows, throwErrorAsString, ddClient, ddToast } from './utils';
import { ExtensionConfig } from '../types';
/**
 * There are two kinds of configurations that are managed and used in the extension:
 * 1. JfrogCliConfig - configurations that are used by JFrog CLI: JFrog Platform URL and credentials.
 * 2. JfrogExtensionConfig - some extra settings that are used in the extension.
 * The Config class contains both configurations, and lets the consumers of the API get all the configurations in one object.
 */
export class Config {
  jfrogCliConfig: JfrogCliConfig;
  jfrogExtensionConfig: JfrogExtensionConfig;

  constructor() {
    this.jfrogCliConfig = new JfrogCliConfig();
    this.jfrogExtensionConfig = new JfrogExtensionConfig();
  }
}

export class JfrogCliConfig {
  url: string | undefined;
  user: string | undefined;
  password: string | undefined;
  accessToken: string | undefined;
}

export class JfrogExtensionConfig {
  project: string | undefined;
  watches: string[] | undefined;
  jfrogCliConfigured: boolean;

  constructor() {
    this.jfrogCliConfigured = false;
  }
}

/**
 * Imports the default configuration from JFrog CLI, if it's already installed and configured on the host.
 */
export async function importConfigFromHostCli(): Promise<void> {
  const exportResponse = await execOnHost('jf', 'jf.exe', ['config', 'export']);
  const serverToken = exportResponse.stdout;
  const importPromise = await execOnHost('runcli.sh', 'runcli.bat', ['config', 'import', serverToken]);
  const jfrogExtensionConf = new JfrogExtensionConfig();
  jfrogExtensionConf.jfrogCliConfigured = true;
  const saveExtensionPromise = await editJfrogExtensionConfig(jfrogExtensionConf);
  await [importPromise, saveExtensionPromise];
}

/**
 * Saves the given configuration.
 * If password or access token is not provided, then JfrogCliConfig is ignored and won't be saved (even if other properties were changed).
 * JfrogExtensionConfig is saved either way.
 */
export async function saveConfig(config: Config): Promise<void> {
  if (config.jfrogCliConfig?.password != undefined || config.jfrogCliConfig?.accessToken != undefined) {
    const serverId = await getJfrogCliConfigServerId();
    try {
      await editCliConfig(config.jfrogCliConfig, serverId);
    } catch (e) {
      throwErrorAsString(e);
    }
  }
  config.jfrogExtensionConfig.jfrogCliConfigured = true;
  try {
    await editJfrogExtensionConfig(config.jfrogExtensionConfig);
  } catch (e) {
    throwErrorAsString(e);
  }
}

/**
 * Gets the current configuration of the extension.
 * Password and access token are omitted.
 */
export async function getConfig(): Promise<Config> {
  const jfrogExtensionConfPromise =await getJfrogExtensionConfig();
  const cliConfPromise =await getJfrogCliConfig();
  const config: Config = new Config();
  try {
    config.jfrogExtensionConfig = jfrogExtensionConfPromise;
    config.jfrogCliConfig = cliConfPromise;
  } catch (e) {
    throwErrorAsString(e);
  }
  return config;
}

export async function getJfrogExtensionConfig(): Promise<JfrogExtensionConfig> {
  let cmdResult;
  try {
    cmdResult = await execOnHost('readconf.sh', 'readconf.bat', []);
  } catch (e: any) {
    if (
      e.stderr !== undefined &&
      (e.stderr.includes('file not found') || e.stderr.includes('The system cannot find the file specified.'))
    ) {
      try {
        await importConfigFromHostCli();
        const jfrogExtensionConf = new JfrogExtensionConfig();
        jfrogExtensionConf.jfrogCliConfigured = true;
        return jfrogExtensionConf;
      } catch (e) {
        return new JfrogExtensionConfig();
      }
    }
    throwErrorAsString(e);
  }

  let jfrogExtensionConfig: JfrogExtensionConfig;
  try {
    jfrogExtensionConfig = JSON.parse(cmdResult.stdout);
  } catch (e: any) {
    console.log('Failed while parsing configuration file', e);
    throw 'Failed while parsing configuration file';
  }
  // Backward compatibility: if jfrogExtensionConfig was found on the machine, then JFrog CLI was already configured.
  if (!jfrogExtensionConfig.jfrogCliConfigured) {
    jfrogExtensionConfig.jfrogCliConfigured = true;
  }
  return jfrogExtensionConfig;
}

async function getJfrogCliConfig(): Promise<JfrogCliConfig> {
  let cliConfigRes;
  try {
    cliConfigRes = await getJfrogCliFullConfig();
  } catch (e) {
    try {
      await importConfigFromHostCli();
      cliConfigRes = await getJfrogCliFullConfig();
    } catch (e) {
      throw 'Your JFrog environment is not configured.';
    }
  }
  return { url: cliConfigRes.url, user: cliConfigRes.user, password: undefined, accessToken: undefined };
}

async function getJfrogCliConfigServerId(): Promise<string | undefined> {
  let cliConfigRes;
  try {
    cliConfigRes = await getJfrogCliFullConfig();
  } catch (e) {
    return undefined;
  }
  return cliConfigRes.serverId;
}

async function getJfrogCliFullConfig(): Promise<any> {
  let cliConfigRes;
  const cliConfResult = await execOnHost('runcli.sh', 'runcli.bat', ['config', 'export']);
  cliConfigRes = JSON.parse(window.atob(cliConfResult.stdout));
  return cliConfigRes;
}

export async function editJfrogExtensionConfig(jfrogExtensionConfig: JfrogExtensionConfig): Promise<void> {
  if (jfrogExtensionConfig.project !== undefined) {
    jfrogExtensionConfig.project = jfrogExtensionConfig.project.trim();
    if (!jfrogExtensionConfig.project.match(/^[a-z0-9]+$/)) {
      throw 'Project key supports only lowercase alphanumeric characters';
    }
  } else if (jfrogExtensionConfig.watches !== undefined) {
    for (const watchIndex in jfrogExtensionConfig.watches) {
      jfrogExtensionConfig.watches[watchIndex] = jfrogExtensionConfig.watches[watchIndex].trim();
      if (jfrogExtensionConfig.watches[watchIndex].includes(' ')) {
        throw 'Watch name cannot contain spaces';
      }
    }
  }
  const configJson = JSON.stringify(jfrogExtensionConfig).replaceAll(' ', '');
  if (await isWindows()) {
    await ddClient?.extension.host?.cli.exec('writeconf.bat', [configJson]);
    return;
  }
  await ddClient?.extension.host?.cli.exec('writeconf.sh', ['"' + configJson.replaceAll('"', '\\"') + '"']);
}

async function editCliConfig(cliConfig: JfrogCliConfig, serverId?: string) {
  const validationServerId = 'validation';
  if (cliConfig.url == undefined) {
    throw 'Please enter URL';
  }

  // In case of unsupported protocol in the URL, add default protocol
  const url: string = cliConfig.url.trim();

  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    cliConfig.url = 'https://' + url;
  }

  const validationConfigAddArgs = buildConfigImportCmd(cliConfig, validationServerId);
  let curlResult;
  await execOnHost('runcli.sh', 'runcli.bat', validationConfigAddArgs);

  let errorCode: string, statusCode: string;
  try {
    curlResult = await execOnHost('scanpermissions.sh', 'scanpermissions.bat', []);
    [errorCode, statusCode] = curlResult.stdout.split(',', 2);
  } catch (e: any) {
    [errorCode, statusCode] = e.stdout.split(',', 2);
    if (errorCode !== '6') {
      throwErrorAsString(e);
    }
  }

  try {
    await execOnHost('runcli.sh', 'runcli.bat', ['c', 'rm', '--quiet', validationServerId]);
  } catch (e) {
    if (statusCode === '200' && errorCode === '0') {
      throwErrorAsString(e);
    }
  }
  if (statusCode !== '200') {
    if (statusCode === '401') {
      throw 'Wrong credentials';
    } else if (statusCode === '403') {
      throw 'Missing permissions';
    } else if (statusCode === '404' || errorCode === '6') {
      throw 'JFrog environment not found at this URL';
    }
    throw 'Error occurred: ' + statusCode;
  }
  try {
    const configAddArgs = buildConfigImportCmd(cliConfig, serverId);
    await execOnHost('runcli.sh', 'runcli.bat', configAddArgs);
  } catch (e) {
    throwErrorAsString(e);
  }
}

function buildConfigImportCmd(cliConfig: JfrogCliConfig, serverId?: string): string[] {
  if (cliConfig.url == undefined) {
    throw 'You must provide JFrog Platform URL';
  }
  if ((cliConfig.user == undefined || cliConfig.password == undefined) && cliConfig.accessToken == undefined) {
    throw 'You must provide username and password OR an access token';
  }
  const conf: any = cliConfig;
  conf.version = 2;
  conf.serverId = serverId;
  const confToken = window.btoa(JSON.stringify(conf));
  return ['config', 'import', confToken];
}

/**
 * Imports the default configuration from JFrog CLI, if it's already installed and configured on the host.
 */
export async function testJFrogPlatformConnection(cliConfig: ExtensionConfig | undefined): Promise<any> {
  try {
    let cmd = ['rt', 'ping'];
    if (cliConfig) {
      const url = cliConfig.url ?? '';
      const trimUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      cmd.push(`--url=${trimUrl}/artifactory`);

      if (cliConfig.username && cliConfig.password) {
        cmd.push(`--user=${cliConfig.username}`);
        cmd.push(`--password=${cliConfig.password}`);
      } else {
        cmd.push(`--access-token=${cliConfig.accessToken}`);
      }
    }
    const pingResponse = await execOnHost('runcli.sh', 'runcli.bat', cmd);
    return pingResponse.stdout;
  } catch (e) {
    throwErrorAsString(e);
  }
}
