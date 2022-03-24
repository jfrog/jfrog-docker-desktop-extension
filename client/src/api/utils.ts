let windowsSystem: boolean | undefined;

export function throwErrorAsString(e: any) {
  let stringErr: string;
  if (e.stderr != undefined) {
    stringErr = e.stderr;
  } else {
    stringErr = e.toString();
  }
  console.log(stringErr);
  throw stringErr;
}

export async function isWindows(): Promise<boolean> {
  if (windowsSystem === undefined) {
    const result = await window.ddClient.docker.cli.exec("info", ["--format", '"{{.OSType }}"']);
    let osType = result.stdout.trim();
    windowsSystem = osType === "windows";
  }
  return windowsSystem;
}
