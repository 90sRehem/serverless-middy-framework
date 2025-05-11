import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "crypto";
import { HttpError } from "../errors/http-error";
import type { Controller } from "../types/controller";
import type { HttpRequest, HttpResponse } from "../types/http";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

type UploadRequest = {
  fileName: string;
  fileType: string;
  fileSize: number;
};

const MB_IN_BYTES = 1024 * 1024;

export class UploadWithPresignedPostController
  implements Controller<UploadRequest>
{
  constructor(
    private readonly s3Client: S3Client,
    private readonly dynamoClient: DynamoDBClient,
  ) {}

  async handler(request: HttpRequest<UploadRequest>): Promise<HttpResponse> {
    const { fileName, fileType, fileSize } = request.body;

    if (!fileName || !fileType || !fileSize) {
      throw new HttpError(400, { error: "Missing parameters!" });
    }

    if (fileSize > MB_IN_BYTES) {
      return new HttpError(400, { error: "File size exceeds 1MB" });
    }

    const fileKey = `${randomUUID()}.${fileName}`;

    const bucketName = process.env.PROFILE_PICTURE_BUCKET;
    const tableName = process.env.PROFILE_PICTURE_TABLE;

    if (!bucketName) {
      throw new HttpError(500, { error: "Bucket not configured" });
    }

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        fileKey: { S: fileKey },
        originalFileName: { S: fileName },
        status: { S: "PENDING" },
        expiresAt: {
          N: `${Math.floor(Date.now() / 1000) + 60}`, // 1 minutes
        },
      },
    });

    try {
      const { url, fields } = await createPresignedPost(this.s3Client, {
        Bucket: bucketName,
        Key: fileKey,
        Expires: 600,
        Fields: {
          // campos que serão enviados no form-data
          "Content-Type": fileType,
        },
        Conditions: [
          ["content-length-range", fileSize, fileSize],
          // { ContentType: fileType }, // syntax sugar for ["eq", "$Content-Type", fileType]
          ["starts-with", "$Content-Type", fileType],
        ],
      });

      await this.dynamoClient.send(putItemCommand);

      return {
        statusCode: 200,
        body: { url, fields },
      };
    } catch (error: any) {
      console.error("Error generating presigned URL:", error);
      throw new HttpError(500, {
        error: "Failed to generate presigned URL",
        details: error.message,
      });
    }
  }
}
