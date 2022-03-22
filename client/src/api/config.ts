import {throwErrorAsString} from "./utils";

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
    let exportResponse = await window.ddClient.extension.host.cli.exec("jf", ["config", "export"]);
    let serverToken = exportResponse.stdout;
    await window.ddClient.extension.host.cli.exec("runcli.sh", ["config", "import", serverToken]);
  } catch (e) {
    throwErrorAsString(e);
  }
}

export async function saveConfig(config: Config): Promise<void> {
  let configJson = JSON.stringify(config.xrayScanConfig).replaceAll('"', '\\"');
  let xrayScanConfPromise = window.ddClient.extension.host.cli.exec("writeconf.sh", ["\"" + configJson + "\""]);
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

export async function getXrayScanConfig(): Promise<XrayScanConfig> {
  let xrayScanConfig;
  try {
    let cmdResult = await window.ddClient.extension.host.cli.exec("readconf.sh");
    xrayScanConfig = JSON.parse(cmdResult.stdout);
  } catch (e) {
    throwErrorAsString(e);
  }
  return xrayScanConfig;
}

async function getJfrogCliConfig(): Promise<JfrogCliConfig> {
  let cliConfigRes = await getJfrogCliFullConfig();
  return {url: cliConfigRes.url, user: cliConfigRes.user, password: undefined, accessToken: undefined}
}

async function getJfrogCliConfigServerId(): Promise<string> {
  let cliConfigRes = await getJfrogCliFullConfig();
  return cliConfigRes.serverId;
}

async function getJfrogCliFullConfig(): Promise<any> {
  let cliConfigRes;
  try {
    let cliConfResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["config", "export"]);
    cliConfigRes = JSON.parse(window.atob(cliConfResult.stdout));
  } catch (e) {
    throwErrorAsString(e);
  }
  return cliConfigRes;
}

async function editCliConfig(cliConfig: JfrogCliConfig, serverId: string) {
  const validationServerId = "validation";
  let validationConfigAddArgs = buildConfigImportCmd(cliConfig, validationServerId);
  let curlResult;
  try {
    await window.ddClient.extension.host.cli.exec("runcli.sh", validationConfigAddArgs);
    curlResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["xr", "curl", "--server-id", validationServerId, "-X", "POST", "-H", "\"Content-Type:application/json\"", "-d", "\"{\\\"component_details\\\":[{\\\"component_id\\\":\\\"testComponent\\\"}]}\"", "-o", "/dev/null", "-w", "%{http_code}", "api/v1/summary/component"]);
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
    await window.ddClient.extension.host.cli.exec("runcli.sh", ["c", "rm", "--quiet", validationServerId])
    let configAddArgs = buildConfigImportCmd(cliConfig, serverId)
    await window.ddClient.extension.host.cli.exec("runcli.sh", configAddArgs)
  } catch (e) {
    throwErrorAsString(e);
  }
}

function buildConfigImportCmd(cliConfig: JfrogCliConfig, serverId: string): string[] {
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
