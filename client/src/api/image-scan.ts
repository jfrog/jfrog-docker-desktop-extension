export async function scanImage(imageTag: string): Promise<any> {
  let cmdResult = await window.ddClient.extension.host.cli.exec("runcli.sh", ["docker", "scan", "--format=json", imageTag])
  return JSON.parse(cmdResult.stdout)
}

export async function getImages(): Promise<any> {
  return window.ddClient.docker.listImages();
}
