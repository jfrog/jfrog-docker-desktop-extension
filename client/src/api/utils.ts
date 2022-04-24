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
    windowsSystem = navigator.platform.startsWith('Win');
  }
  return windowsSystem;
}

export class Versions {
  xrayVersion?: string;
  jfrogCliVersion?: string;
}

export async function getVersions(): Promise<Versions> {
  let xrayVersionPromise = execOnHost('runcli.sh', 'runcli.bat', ['xr', 'curl', 'api/v1/system/version']);
  let jfrogCliVersionPromise = execOnHost('runcli.sh', 'runcli.bat', ['-v']);
  let versions: Versions = new Versions();
  try {
    let results = await Promise.all([xrayVersionPromise, jfrogCliVersionPromise]);
    let xrayResult = JSON.parse(results[0].stdout);
    let jfrogCliResult = results[1].stdout.trim().split(" ");
    versions.xrayVersion = xrayResult.xray_version;
    versions.jfrogCliVersion = jfrogCliResult[jfrogCliResult.length - 1];
  } catch (e) {
    throwErrorAsString(e);
  }
  return versions;
}
