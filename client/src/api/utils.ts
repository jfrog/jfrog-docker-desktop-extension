import { createDockerDesktopClient } from '@docker/extension-api-client';
import { ExecProcess } from '@docker/extension-api-client-types/dist/v1';
import { ExecStreamOptions } from '@docker/extension-api-client-types/dist/v1/exec';

export const isDevelopment: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const ddClient = !isDevelopment ? createDockerDesktopClient() : null;
export const ddToast: any =
  ddClient?.desktopUI?.toast ??
  new Proxy(
    {},
    {
      get(t, prop) {
        switch (prop) {
          case 'error':
            return console.error;
          case 'warning':
            return console.warn;
          default:
            return console.log;
        }
      },
    }
  );

let windowsSystem: boolean | undefined;

export function getDockerDesktopClient() {
  return;
}

export function throwErrorAsString(e: any) {
  console.error(e);
  let stringErr: string;
  if (e.stderr !== undefined) {
    stringErr =
      'An error occurred. You can find the logs in your home directory under ".jfrog-docker-desktop-extension/logs".';
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
    return ddClient?.extension.host?.cli.exec(windowsCmd, args);
  }
  return ddClient?.extension.host?.cli.exec(unixCmd, args);
}

/**
 * Executes a command on the host machine, and streams the output, even before the process is closed.
 * @param unixCmd command, binary or script to run on macOS and Linux machines.
 * @param windowsCmd command, binary or script to run on Windows machines.
 * @param args
 * @param options an ExecStreamOptions object, as described in Docker Desktop Extensions docs.
 */
export async function execOnHostAndStreamResult(
  unixCmd: string,
  windowsCmd: string,
  args: string[],
  options: { stream: ExecStreamOptions }
): Promise<ExecProcess | undefined> {
  if (await isWindows()) {
    return ddClient?.extension.host?.cli.exec(windowsCmd, args, options);
  }
  return ddClient?.extension.host?.cli.exec(unixCmd, args, options);
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
  const xrayVersionPromise = execOnHost('runcli.sh', 'runcli.bat', ['xr', 'curl', 'api/v1/system/version']);
  const jfrogCliVersionPromise = execOnHost('runcli.sh', 'runcli.bat', ['-v']);
  const versions: Versions = new Versions();
  try {
    const results = await Promise.all([xrayVersionPromise, jfrogCliVersionPromise]);
    const xrayResult = JSON.parse(results[0].stdout);
    const jfrogCliResult = results[1].stdout.trim().split(' ');
    versions.xrayVersion = xrayResult.xray_version;
    versions.jfrogCliVersion = jfrogCliResult[jfrogCliResult.length - 1];
  } catch (e) {
    throwErrorAsString(e);
  }
  return versions;
}
