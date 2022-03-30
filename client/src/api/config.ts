import {execOnHost, isWindows, throwErrorAsString} from "./utils";

export class Config {
  jfrogCliConfig: JfrogCliConfig
  jfrogExtensionConfig: JfrogExtensionConfig

  constructor() {
    this.jfrogCliConfig = new JfrogCliConfig()
    this.jfrogExtensionConfig = new JfrogExtensionConfig()
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

export async function importConfigFromHostCli(): Promise<void> {
  try {
    let exportResponse = await execOnHost("jf", "jf.exe", ["config", "export"]);
    let serverToken = exportResponse.stdout;
    await execOnHost("runcli.sh", "runcli.bat", ["config", "import", serverToken]);
  } catch (e) {
    throwErrorAsString(e);
  }
}

export async function saveConfig(config: Config): Promise<void> {
  config.jfrogExtensionConfig.jfrogCliConfigured = true;
  let editJfrogExtConfPromise = editJfrogExtensionConfig(config.jfrogExtensionConfig);
  let savePromises: Promise<any>[] = [editJfrogExtConfPromise];
  if (config.jfrogCliConfig?.password != undefined || config.jfrogCliConfig?.accessToken != undefined) {
    let serverId = await getJfrogCliConfigServerId();
    savePromises.push(editCliConfig(config.jfrogCliConfig, serverId));
  }
  try {
    await Promise.all(savePromises);
  } catch (e) {
    throwErrorAsString(e);
  }
}

export async function getConfig(): Promise<Config> {
  let jfrogExtensionConfPromise = getJfrogExtensionConfig();
  let cliConfPromise = getJfrogCliConfig();
  let config: Config = new Config();
  try {
    let results = await Promise.all([jfrogExtensionConfPromise, cliConfPromise]);
    config.jfrogExtensionConfig = results[0];
    config.jfrogCliConfig = results[1];
  } catch (e) {
    throwErrorAsString(e);
  }
  return config;
}

export async function getJfrogExtensionConfig(): Promise<JfrogExtensionConfig> {
  let cmdResult;
  try {
    cmdResult = await execOnHost("readconf.sh", "readconf.bat");
  } catch (e: any) {
    if (e.stderr !== undefined && (e.stderr.includes("file not found") || e.stderr.includes("The system cannot find the file specified."))) {
      return new JfrogExtensionConfig();
    }
    throwErrorAsString(e);
  }

  let jfrogExtensionConfig: JfrogExtensionConfig;
  try {
    jfrogExtensionConfig = JSON.parse(cmdResult.stdout);
  } catch (e: any) {
    console.log("Failed while parsing configuration file", e);
    throw "Failed while parsing configuration file";
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
    await importConfigFromHostCli();
    cliConfigRes = await getJfrogCliFullConfig();
  }
  return {url: cliConfigRes.url, user: cliConfigRes.user, password: undefined, accessToken: undefined}
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
  try {
    let cliConfResult = await execOnHost("runcli.sh", "runcli.bat", ["config", "export"]);
    cliConfigRes = JSON.parse(window.atob(cliConfResult.stdout));
  } catch (e) {
    throwErrorAsString(e);
  }
  return cliConfigRes;
}

async function editJfrogExtensionConfig(jfrogExtensionConfig: JfrogExtensionConfig): Promise<any> {
  if (jfrogExtensionConfig.project !== undefined) {
    jfrogExtensionConfig.project = jfrogExtensionConfig.project.trim();
    if (!jfrogExtensionConfig.project.match(/^[a-z0-9]+$/)) {
      throw "Project key supports only lowercase alphanumeric characters";
    }
  } else if (jfrogExtensionConfig.watches !== undefined) {
    for (let watchIndex in jfrogExtensionConfig.watches) {
      jfrogExtensionConfig.watches[watchIndex] = jfrogExtensionConfig.watches[watchIndex].trim();
      if (jfrogExtensionConfig.watches[watchIndex].includes(" ")) {
        throw "Watch name cannot contain spaces";
      }
    }
  }
  let configJson = JSON.stringify(jfrogExtensionConfig).replaceAll(" ", "");
  if (await isWindows()) {
    return window.ddClient.extension.host.cli.exec("writeconf.bat", [configJson]);
  }
  return window.ddClient.extension.host.cli.exec("writeconf.sh", ['"' + configJson.replaceAll('"', '\\"') + '"']);
}

async function editCliConfig(cliConfig: JfrogCliConfig, serverId?: string) {
  const validationServerId = "validation";
  let validationConfigAddArgs = buildConfigImportCmd(cliConfig, validationServerId);
  let curlResult;
  try {
    await execOnHost("runcli.sh", "runcli.bat", validationConfigAddArgs);
    curlResult = await execOnHost("scanpermissions.sh", "scanpermissions.bat");
  } catch (e) {
    throwErrorAsString(e);
  }
  let statusCode = curlResult.stdout
  if (statusCode !== "200") {
    if (statusCode === "401") {
      throw "Wrong credentials"
    } else if (statusCode === "403") {
      throw "Missing permissions"
    }
    throw "Error occurred: " + statusCode
  }
  try {
    await execOnHost("runcli.sh", "runcli.bat", ["c", "rm", "--quiet", validationServerId])
    let configAddArgs = buildConfigImportCmd(cliConfig, serverId)
    await execOnHost("runcli.sh", "runcli.bat", configAddArgs)
  } catch (e) {
    throwErrorAsString(e);
  }
}

function buildConfigImportCmd(cliConfig: JfrogCliConfig, serverId?: string): string[] {
  if (cliConfig.url == undefined) {
    throw "You must provide JFrog Platform URL";
  }
  if ((cliConfig.user == undefined || cliConfig.password == undefined) && cliConfig.accessToken == undefined) {
    throw "You must provide username and password OR an access token";
  }
  let conf: any = cliConfig;
  conf.version = 2;
  conf.serverId = serverId;
  let confToken = window.btoa(JSON.stringify(conf));
  return ["config", "import", confToken];
}
