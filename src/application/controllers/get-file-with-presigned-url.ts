import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { HttpError } from "../errors/http-error";
import type { Controller } from "../types/controller";
import type { HttpRequest, HttpResponse } from "../types/http";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

type GetFileRequest = {
  filename: string;
};

export class GetFileWithPresignedUrlController
  implements Controller<GetFileRequest>
{
  constructor(
    private readonly s3Client: S3Client,
    private readonly dynamoClient: DynamoDBClient,
  ) {}

  async handler(request: HttpRequest<GetFileRequest>): Promise<HttpResponse> {
    const { filename } = request.body;

    if (!filename) {
      throw new HttpError(400, { error: "File not found" });
    }

    const bucketName = process.env.PROFILE_PICTURE_BUCKET;
    const tableName = process.env.PROFILE_PICTURE_TABLE;
    if (!bucketName) {
      throw new HttpError(500, { error: "Bucket not configured" });
    }

    const putObjectCommand = new GetObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    const putItemCommand = new PutItemCommand({
      TableName: tableName,
      Item: {
        fileKey: { S: filename },
      },
    });

    try {
      const url = await getSignedUrl(this.s3Client, putObjectCommand, {
        expiresIn: 120,
      });
      const { Attributes } = await this.dynamoClient.send(putItemCommand);
      return {
        statusCode: 200,
        body: {
          filename,
          downloadUrl: url,
          Attributes,
        },
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
