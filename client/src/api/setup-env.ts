import { execOnHostAndStreamResult } from './utils';

/**
 * Setups a new JFrog environment. It opens a registration form in a browser window and saves the environments details in the configuration.
 */
export async function setupEnv(setPreparingEnv: () => void): Promise<void> {
  console.log('Running setup command');
  await execOnHostAndStreamResult('runcli.sh', 'runcli.bat', ['setup', '--format=machine'], {
    stream: {
      splitOutputLines: true,
      onOutput(data: { stdout: string; stderr?: undefined } | { stdout?: undefined; stderr: string }): void {
        if (data.stdout === 'PREPARING_ENV') {
          setPreparingEnv();
          console.log('The new environment is being built');
        }
      },
      onError(error: any): void {
        console.error(error);
      },
      onClose(exitCode: number): void {
        console.log('Setup command finished with exit code ' + exitCode);
      },
    },
  });
}
