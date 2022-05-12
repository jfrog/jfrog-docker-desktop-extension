import { createDockerDesktopClient } from "@docker/extension-api-client";

const ddClient = createDockerDesktopClient();

let windowsSystem: boolean | undefined;

export function throwErrorAsString(e: any) {
  let stringErr: string;
  if (e.stderr !== undefined) {
    stringErr = "An error occurred. You can find the logs in your home directory under \".jfrog-docker-desktop-extension/logs\".";
  } else {
    stringErr = e.toString();
  }
  throw stringErr;
}

/**
 * Executes a command on the host machine. Results and outputs are returned when the process is closed.
 * @param unixCmd command, binary or script to run on macOS and Linux machines.
 * @param windowsCmd command, binary or script to run on Windows machines.
 * @param args
 */
export async function execOnHost(unixCmd: string, windowsCmd: string, args: string[]): Promise<any> {
  if (await isWindows()) {
    return ddClient.extension.host?.cli.exec(windowsCmd, args);
  }
  return ddClient.extension.host?.cli.exec(unixCmd, args);
}

/**
 * Executes a command on the host machine, and streams the output, even before the process is closed.
 * @param unixCmd command, binary or script to run on macOS and Linux machines.
 * @param windowsCmd command, binary or script to run on Windows machines.
 * @param args
 * @param options an ExecStreamOptions object, as described in Docker Desktop Extensions docs.
 */
export async function execOnHostAndStreamResult(unixCmd: string, windowsCmd: string, args: string[], options: any): Promise<any> {
  if (await isWindows()) {
    return ddClient.extension.host?.cli.exec(windowsCmd, args, options);
  }
  return ddClient.extension.host?.cli.exec(unixCmd, args, options);
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

/**
 * Gets the versions of JFrog CLI (that's used by the extension) and JFrog Xray.
 */
export async function getVersions(): Promise<Versions> {
  let xrayVersionPromise = execOnHost('runcli.sh', 'runcli.bat', ['xr', 'curl', 'api/v1/system/version']);
  let jfrogCliVersionPromise = execOnHost('runcli.sh', 'runcli.bat', ['-v']);
  let versions: Versions = new Versions();
  try {
    let results = await Promise.all([xrayVersionPromise, jfrogCliVersionPromise]);
    let xrayResult = JSON.parse(results[0].stdout);
    let jfrogCliResult = results[1].stdout.trim().split(' ');
    versions.xrayVersion = xrayResult.xray_version;
    versions.jfrogCliVersion = jfrogCliResult[jfrogCliResult.length - 1];
  } catch (e) {
    throwErrorAsString(e);
  }
  return versions;
}
