import { s3Client } from "../../application/clients/s3-client";
import { UploadController } from "../../application/controllers/upload-controller";

export function makeuploadController() {
  return new UploadController(s3Client);
}
