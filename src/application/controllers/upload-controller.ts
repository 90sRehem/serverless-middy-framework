import { HttpError } from "../errors/http-error";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import type { Controller } from "../types/controller";
import type { File } from "../types/file";
import type { HttpRequest, HttpResponse } from "../types/http";

type UploadRequest = {
  file: File;
};

export class UploadController implements Controller<UploadRequest> {
  constructor(private readonly client: S3Client) {}
  async handler(request: HttpRequest<UploadRequest>): Promise<HttpResponse> {
    const { file } = request.body;

    if (!file) {
      throw new HttpError(400, { error: "File not found" });
    }

    const fileName = `${randomUUID()}.${file.filename}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.PROFILE_PICTURE_BUCKET,
      Key: fileName,
      Body: file.content,
    });

    await this.client.send(putObjectCommand);

    return {
      statusCode: 200,
      body: {
        fileName,
      },
    };
  }
}
