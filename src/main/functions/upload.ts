import { makeGetFileWithPresignedUrlController } from "../factories/make-get-file-with-presigned-url";
import { makeuploadController } from "../factories/make-upload-controller";
import { makeUploadWithPresignedBatchPostController } from "../factories/make-upload-presigned-batch-post-controller";
import { makeUploadWithPresignedPostController } from "../factories/make-upload-presigned-post-controller";
import { makeCorsOnlyHandler } from "../middy/make-cors-only-handler";
import { makeHandler } from "../middy/make-handler";
import { makeHandlerWithMultipart } from "../middy/make-handler-with-multipart";
import { makeRoutesHandler } from "../middy/make-routes-handler";

export const handler = makeRoutesHandler([
  {
    path: "/upload",
    handler: makeHandlerWithMultipart(makeuploadController()),
    method: "POST",
  },
  {
    path: "/upload/presigned-url",
    handler: makeHandler(makeGetFileWithPresignedUrlController()),
    method: "POST",
  },

  {
    path: "/upload/get-file-presigned-url",
    handler: makeHandler(makeGetFileWithPresignedUrlController()),
    method: "POST",
  },
  {
    path: "/upload/presigned-post",
    handler: makeHandlerWithMultipart(makeUploadWithPresignedPostController()),
    method: "POST",
  },
  {
    path: "/upload/presigned-batch-post",
    handler: makeHandlerWithMultipart(
      makeUploadWithPresignedBatchPostController(),
    ),
    method: "POST",
  },
  {
    path: "/upload/presigned-post",
    handler: makeCorsOnlyHandler(),
    method: "OPTIONS",
  },
  {
    path: "/upload/presigned-batch-post",
    handler: makeCorsOnlyHandler(),
    method: "OPTIONS",
  },
]);
