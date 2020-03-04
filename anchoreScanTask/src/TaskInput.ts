
import task = require("azure-pipelines-task-lib");

export class TaskInput {
  static getEngineUrl(): string {
    const anchoreUrl: string | undefined = task.getInput(
      "engineUrl",
      true
    );

    if (anchoreUrl === undefined || anchoreUrl.length === 0)
      throw new Error("AnchoreUrl is a required parameter that must have a value");
    return anchoreUrl;
  }

  static getEngineUser(): string {
    const anchoreUser: string | undefined = task.getInput(
      "engineUser",
      true
    );
    
    if (engineUser === undefined || engineUser.length === 0)
      throw new Error("AnchoreUser is a required parameter that must have a value");
    return engineUser;
  }

  static getEnginePassword(): string {
    const anchorePassword: string | undefined = task.getInput(
      "enginePassword",
      true
    );

    if (enginePassword === undefined || enginePassword.length === 0)
      throw new Error("AnchorePassword is a required parameter that must have a value");
    return enginePassword;
  }

  static getImageName(): string {
    const anchoreImage: string | undefined = task.getInput("imageName", true);
    if (anchoreImage === undefined || anchoreImage.length === 0)
      throw new Error("An image name for analysis must be provided");

      return anchoreImage;
  }

  static getExecutePolicyScan(): boolean {
    return task.getBoolInput("doPolicyScan") || false;
  }

}
