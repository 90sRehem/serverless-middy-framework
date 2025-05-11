import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { HttpError } from "../errors/http-error";
import type { Controller } from "../types/controller";
import type { HttpRequest, HttpResponse } from "../types/http";

type UploadRequest = {
  filename: string;
};

export class UploadWithPresignedUrlController
  implements Controller<UploadRequest>
{
  constructor(private readonly client: S3Client) {}

  async handler(request: HttpRequest<UploadRequest>): Promise<HttpResponse> {
    const { filename } = request.body;

    if (!filename) {
      throw new HttpError(400, { error: "File not found" });
    }

    const fileName = `${randomUUID()}.${filename}`;

    const bucketName = process.env.PROFILE_PICTURE_BUCKET;
    if (!bucketName) {
      throw new HttpError(500, { error: "Bucket not configured" });
    }

    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    try {
      const url = await getSignedUrl(this.client, putObjectCommand, {
        expiresIn: 120,
      });
      return {
        statusCode: 200,
        body: {
          fileName,
          url,
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
