let windowsSystem: boolean | undefined;

export function throwErrorAsString(e: any) {
  let stringErr: string;
  if (e.stderr !== undefined) {
    stringErr = e.stderr;
  } else {
    stringErr = e.toString();
  }
  console.log(stringErr);
  throw stringErr;
}

export async function execOnHost(unixCmd: string, windowsCmd: string, args?: string[]): Promise<any> {
  if (await isWindows()) {
    return window.ddClient.extension.host.cli.exec(windowsCmd, args);
  }
  return window.ddClient.extension.host.cli.exec(unixCmd, args);
}

export async function isWindows(): Promise<boolean> {
  if (windowsSystem === undefined) {
    try {
      await window.ddClient.extension.host.cli.exec("iswindows.bat");
      windowsSystem = true;
    } catch (e: any) {
      if (e.stderr !== undefined && e.stderr.includes("No such file or directory")) {
        windowsSystem = false;
      } else {
        throw "Couldn't determine the host operating system";
      }
    }
  }
  return windowsSystem;
}
