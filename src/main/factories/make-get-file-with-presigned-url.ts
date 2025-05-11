import { dynamoClient } from "../../application/clients/dynamo-client";
import { s3Client } from "../../application/clients/s3-client";
import { GetFileWithPresignedUrlController } from "../../application/controllers/get-file-with-presigned-url";

export function makeGetFileWithPresignedUrlController() {
  return new GetFileWithPresignedUrlController(s3Client, dynamoClient);
}
