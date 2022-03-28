import {execOnHost, isWindows, throwErrorAsString} from "./utils";

export class Config {
  jfrogCliConfig: JfrogCliConfig
  xrayScanConfig: XrayScanConfig

  constructor() {
    this.jfrogCliConfig = new JfrogCliConfig()
    this.xrayScanConfig = new XrayScanConfig()
  }
}

export class JfrogCliConfig {
  url: string | undefined;
  user: string | undefined;
  password: string | undefined;
  accessToken: string | undefined;
}

export class XrayScanConfig {
  project: string | undefined;
  watches: string[] | undefined;
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
  let xrayScanConfPromise = editXrayScanConfig(config.xrayScanConfig);
  let savePromises: Promise<any>[] = [xrayScanConfPromise];
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
  let xrayScanConfPromise = getXrayScanConfig();
  let cliConfPromise = getJfrogCliConfig();
  let config: Config = new Config();
  try {
    let results = await Promise.all([xrayScanConfPromise, cliConfPromise]);
    config.xrayScanConfig = results[0];
    config.jfrogCliConfig = results[1];
  } catch (e) {
    throwErrorAsString(e);
  }
  return config;
}

async function getXrayScanConfig(): Promise<XrayScanConfig> {
  let cmdResult;
  try {
    cmdResult = await execOnHost("readconf.sh", "readconf.bat");
  } catch (e: any) {
    if (e.stderr !== undefined && (e.stderr.includes("No such file or directory") || e.stderr.includes("The system cannot find the file specified."))) {
      await saveConfig(new Config());
    }
    try {
      cmdResult = await execOnHost("readconf.sh", "readconf.bat");
    } catch (e: any) {
      throwErrorAsString(e);
    }
  }

  let xrayScanConfig;
  try {
    xrayScanConfig = JSON.parse(cmdResult.stdout);
  } catch (e: any) {
    console.log("Failed while parsing configuration file", e);
    throw "Failed while parsing configuration file";
  }
  return xrayScanConfig;
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

async function editXrayScanConfig(xrayScanConfig: XrayScanConfig): Promise<any> {
  if (xrayScanConfig.project !== undefined) {
    xrayScanConfig.project = xrayScanConfig.project.trim();
    if (!xrayScanConfig.project.match(/^[a-z0-9]+$/)) {
      throw "Project key supports only lowercase alphanumeric characters";
    }
  } else if (xrayScanConfig.watches !== undefined) {
    for (let watchIndex in xrayScanConfig.watches) {
      xrayScanConfig.watches[watchIndex] = xrayScanConfig.watches[watchIndex].trim();
      if (xrayScanConfig.watches[watchIndex].includes(" ")) {
        throw "Watch name cannot contain spaces";
      }
    }
  }
  let configJson = JSON.stringify(xrayScanConfig).replaceAll(" ", "");
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
