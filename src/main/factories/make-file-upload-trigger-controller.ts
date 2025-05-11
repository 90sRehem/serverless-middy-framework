import { dynamoClient } from "../../application/clients/dynamo-client";
import { FileUploadTriggerController } from "../../application/controllers/file-upload-trigger";

export function makeFileUploadTriggerController() {
  return new FileUploadTriggerController(dynamoClient);
}
