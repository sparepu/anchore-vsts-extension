import task = require("azure-pipelines-task-lib");
import commandExists from "command-exists";
import { AnchoreService } from "./services/AnchoreService";

import { TaskInput } from './TaskInput';
import { VulnSeverity, PolicyCheckStatus } from './enum';
import { AnalyzeImageService } from "./services/AnalyzeImageService";
import { VulnerabilityScanService } from "./services/VulnerabilityScanService";

async function run() {
  // does anchor-cli exist
  var exists = commandExists.sync("anchore-cli");
  if (!exists) {
    task.setResult(task.TaskResult.Failed, "anchore-cli is not installed");
    return;
  }

  var service = new AnchoreService(
    TaskInput.getEngineUser(),
    TaskInput.getEnginePassword(),
    TaskInput.getEngineUrl()
  );

  try {
    // add the image to anchore engine
    service.addImage(TaskInput.getImageName());

    // analyze the image
    const analysisService = new AnalyzeImageService(service);
    const imageAnalyzed: boolean = await analysisService.analyzeImage(TaskInput.getImageName());
    if (!imageAnalyzed) {
      task.setResult(task.TaskResult.Failed, "Image failed to be analyzed");
      return;
    }

    if (TaskInput.getExecutePolicyScan()) {
      var result = service.getPolicyEvaluateResult(TaskInput.getImageName());
      if (result.status == PolicyCheckStatus.FAIL) {
        task.setResult(task.TaskResult.Failed, 'Image Failed Policy Check');
        return;
      }
    }
    
    console.log("Image analysis successful");
  }
  catch (err) {
    console.log(err);
    task.setResult(task.TaskResult.Failed, 'Error Executing the Scan');
  }
}

run();
