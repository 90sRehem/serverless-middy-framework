import { dynamoClient } from "../../application/clients/dynamo-client";
import { s3Client } from "../../application/clients/s3-client";
import { UploadWithPresignedPostController } from "../../application/controllers/upload-with-presigned-post";

export function makeUploadWithPresignedPostController() {
  return new UploadWithPresignedPostController(s3Client, dynamoClient);
}
