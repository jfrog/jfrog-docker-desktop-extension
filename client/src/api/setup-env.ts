import {execOnHostAndStreamResult} from "./utils";

export const enum SetupStage {
  Idle,
  WaitingForUser,
  PreparingEnv,
  Done,
  Error
}

export var setupStage: SetupStage = SetupStage.Idle;

/**
 * Setups a new JFrog environment. It opens a registration form in a browser window and saves the environments details in the configuration.
 * After calling this function, use the setupStage public property to check out the stage of the setup process.
 */
export async function setupEnv(): Promise<void> {
  setupStage = SetupStage.WaitingForUser;
  console.log("Running setup command");
  await execOnHostAndStreamResult('runcli.sh', 'runcli.bat', ["setup", "--format=machine"], {
    stream: {
      splitOutputLines: true,
      onOutput(data: { stdout: string; stderr?: undefined } | { stdout?: undefined; stderr: string }): void {
        if (data.stdout === "PREPARING_ENV") {
          setupStage = SetupStage.PreparingEnv;
          console.log("The new environment is being built");
        }
      },
      onError(error: any): void {
        console.error(error);
        setupStage = SetupStage.Error;
      },
      onClose(exitCode: number): void {
        console.log("Setup command finished with exit code " + exitCode);
        setupStage = SetupStage.Done;
      }
    }
  });
}
