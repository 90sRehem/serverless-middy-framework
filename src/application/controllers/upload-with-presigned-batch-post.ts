import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { HttpError } from "../errors/http-error";
import type { Controller } from "../types/controller";
import type { HttpRequest, HttpResponse } from "../types/http";

type UploadRequest = {
  files: File[];
};

const MB_IN_BYTES = 1024 * 1024;

export class UploadWithPresignedBatchPostController
  implements Controller<UploadRequest>
{
  constructor(private readonly client: S3Client) {}

  async handler(request: HttpRequest<UploadRequest>): Promise<HttpResponse> {
    const { files } = request.body;

    const invalidFileIndex = files.findIndex((file) => {
      return !file.name || !file.type || !file.size;
    });

    if (invalidFileIndex >= 0) {
      throw new HttpError(400, {
        error: `fileName, fileType and fileSize are required for files[${invalidFileIndex}]`,
      });
    }

    const invalidFileSizeIndex = files.findIndex((file) => {
      return file.size > MB_IN_BYTES;
    });

    if (invalidFileIndex >= 0) {
      return new HttpError(400, {
        error: `The files[${invalidFileSizeIndex}] exceeds 1MB`,
      });
    }

    const bucketName = process.env.PROFILE_PICTURE_BUCKET;

    if (!bucketName) {
      throw new HttpError(500, { error: "Bucket not configured" });
    }
    const tagging =
      "<Tagging><TagSet><Tag><Key>apply-lifecycle</Key><Value>true</Value></Tag></TagSet></Tagging>";

    try {
      const { url, fields } = await createPresignedPost(this.client, {
        Bucket: bucketName,
        Key: "${filename}", // adiciona condition `starts-with` automaticamente para o nome dos arquivos assim o s3
        Expires: 600,
        Conditions: [
          ["content-length-range", 0, MB_IN_BYTES],
          ["starts-with", "$Content-Type", "image/"],
          { tagging },
        ],
        Fields: { tagging },
      });

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
