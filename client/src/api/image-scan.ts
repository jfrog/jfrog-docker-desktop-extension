import {getXrayScanConfig} from "./config";

export async function scanImage(imageTag: string): Promise<any> {
  let xrayScanConfig = await getXrayScanConfig()
  let cmdArgs: string[] = ["docker", "scan", imageTag, "--format", "json"]
  if (xrayScanConfig.project != undefined) {
    cmdArgs.push("--project", '"' + xrayScanConfig.project + '"')
  } else if (xrayScanConfig.watches != undefined) {
    cmdArgs.push("--watches", '"' + xrayScanConfig.watches.join(",") + '"')
  }
  let cmdResult = await window.ddClient.extension.host.cli.exec("runcli.sh", cmdArgs)
  return JSON.parse(cmdResult.stdout)
}

export async function getImages(): Promise<any> {
  return window.ddClient.docker.listImages();
}
