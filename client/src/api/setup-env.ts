import {execOnHostAndStreamResult} from "./utils";

/**
 * Setups a new JFrog environment. It opens a registration form in a browser window and saves the environments details in the configuration.
 * After calling this function, use the setupStage public property to check out the stage of the setup process.
 */
export async function setupEnv(setPreparingEnv: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('Running setup command');
    execOnHostAndStreamResult('runcli.sh', 'runcli.bat', ['setup', '--format=machine'], {
      stream: {
        splitOutputLines: true,
        onOutput(data: { stdout: string; stderr?: undefined } | { stdout?: undefined; stderr: string }): void {
          if (data.stdout === 'PREPARING_ENV') {
            console.log('The new environment is being built');
            setPreparingEnv();
          }
        },
        onError(error: any): void {
          console.error(error);
          reject(error);
        },
        onClose(exitCode: number): void {
          console.log('Setup command finished with exit code ' + exitCode);
          if (exitCode === 0) {
            resolve();
          } else {
            reject("Setup failed");
          }
        },
      },
    });
  });
}
