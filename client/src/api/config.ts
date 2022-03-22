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
  repoPath: string | undefined;
  watches: string[] | undefined;
}

export async function importConfigFromHostCli(): Promise<void> {
  let exportResponse = await window.ddClient.extension.host.cli.exec("jf", ["config", "export"]);
  let serverToken = exportResponse.stdout;
  await window.ddClient.extension.host.cli.exec("runcli.sh", ["config", "import", serverToken]);
}

export async function saveConfig(config: Config): Promise<any> {
  let configJson = JSON.stringify(config.xrayScanConfig).replaceAll('"', '\\"');
  let xrayScanConfPromise = window.ddClient.extension.host.cli.exec("writeconf.sh", ["\"" + configJson + "\""]);
  let savePromises: Promise<any>[] = [xrayScanConfPromise];
  if (config.jfrogCliConfig?.password != undefined || config.jfrogCliConfig?.accessToken != undefined) {
    let serverId = await getJfrogCliConfigServerId();
    savePromises.push(editCliConfig(config.jfrogCliConfig, serverId));
  }
  let results = await Promise.all(savePromises);
  return JSON.parse(results[0].stdout);
}

export async function getConfig(): Promise<Config> {
  let xrayScanConfPromise = getXrayScanConfig();
  let cliConfPromise = getJfrogCliConfig()
  let results = await Promise.all([xrayScanConfPromise, cliConfPromise]);
  return {xrayScanConfig: results[0], jfrogCliConfig: results[1]};
}

export async function getXrayScanConfig(): Promise<XrayScanConfig> {
  let cmdResult = await window.ddClient.extension.host.cli.exec("readconf.sh");
  return JSON.parse(cmdResult.stdout);
}

async function getJfrogCliConfig(): Promise<JfrogCliConfig> {
  let cliConfResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["config", "export"]);
  let cliConfigRes = JSON.parse(window.atob(cliConfResult.stdout));
  return {url: cliConfigRes.url, user: cliConfigRes.user, password: undefined, accessToken: undefined}
}

async function getJfrogCliConfigServerId(): Promise<string> {
  let cliConfResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["config", "export"]);
  let cliConfigRes = JSON.parse(window.atob(cliConfResult.stdout));
  return cliConfigRes.serverId;
}

async function editCliConfig(cliConfig: JfrogCliConfig, serverId: string) {
  const validationServerId = "validation"
  let validationConfigAddArgs = buildConfigImportCmd(cliConfig, validationServerId)
  await window.ddClient.extension.host.cli.exec("runcli.sh", validationConfigAddArgs)
  let curlResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["xr", "curl", "--server-id", validationServerId, "-X", "POST", "-H", "\"Content-Type:application/json\"", "-d", "\"{\\\"component_details\\\":[{\\\"component_id\\\":\\\"testComponent\\\"}]}\"", "-o", "/dev/null", "-w", "%{http_code}", "api/v1/summary/component"])
  let statusCode = curlResult.stdout
  if (statusCode !== "200") {
    if (statusCode === "401") {
      throw "Wrong credentials"
    } else if (statusCode === "403") {
      throw "Missing permissions"
    }
    throw "Error occurred: " + statusCode
  }
  await window.ddClient.extension.host.cli.exec("runcli.sh", ["c", "rm", "--quiet", validationServerId])
  let configAddArgs = buildConfigImportCmd(cliConfig, serverId)
  await window.ddClient.extension.host.cli.exec("runcli.sh", configAddArgs)
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
