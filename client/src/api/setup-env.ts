import { execOnHostAndStreamResult } from './utils';
import { editJfrogExtensionConfig, JfrogExtensionConfig } from './config';

/**
 * Sets up a new JFrog environment. It opens a registration form in a browser window and saves the environments details in the configuration.
 */
export async function setupEnv(setPreparingEnv: () => void): Promise<void> {
  await new Promise<void>((resolve, reject) => {
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
            reject('Setup failed');
          }
        },
      },
    });
  });
  const jfrogExtensionConf = new JfrogExtensionConfig();
  jfrogExtensionConf.jfrogCliConfigured = true;
  return editJfrogExtensionConfig(jfrogExtensionConf);
}
