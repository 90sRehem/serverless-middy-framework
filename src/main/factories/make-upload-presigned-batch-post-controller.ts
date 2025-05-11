import { s3Client } from "../../application/clients/s3-client";
import { UploadWithPresignedBatchPostController } from "../../application/controllers/upload-with-presigned-batch-post";

export function makeUploadWithPresignedBatchPostController() {
  return new UploadWithPresignedBatchPostController(s3Client);
}
