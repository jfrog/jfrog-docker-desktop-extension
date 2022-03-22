import {getXrayScanConfig} from "./config";
import {throwErrorAsString} from "./utils";

export async function scanImage(imageTag: string): Promise<any> {
  let xrayScanConfig = await getXrayScanConfig();
  let cmdArgs: string[] = ["docker", "scan", imageTag, "--format", "json"];
  if (xrayScanConfig.project != undefined) {
    cmdArgs.push("--project", '"' + xrayScanConfig.project + '"');
  } else if (xrayScanConfig.watches != undefined) {
    cmdArgs.push("--watches", '"' + xrayScanConfig.watches.join(",") + '"');
  }
  let scanResults;
  try {
    let cmdResult = await window.ddClient.extension.host.cli.exec("runcli.sh", cmdArgs);
    scanResults = JSON.parse(cmdResult.stdout);
  } catch (e) {
    throwErrorAsString(e);
  }
  return scanResults;
}

export async function getImages(): Promise<any> {
  return window.ddClient.docker.listImages();
}
