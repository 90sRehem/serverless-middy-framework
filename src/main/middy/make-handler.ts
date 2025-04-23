import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";
import httpMultipartBodyParser from "@middy/http-multipart-body-parser";

import { errorHandler } from "./middlewares/error-handler";
import { HttpRequest, HttpResponse } from "../../application/types/http";
import { Controller } from "../../application/types/controller";
import { sanitizeObject } from "../utils/sanitize-object";

export function makeHandler(controller: Controller<any>) {
  return middy()
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(httpMultipartBodyParser({ disableContentTypeError: true }))
    .use(errorHandler())
    .use(
      httpResponseSerializer({
        defaultContentType: "application/json",
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body),
          },
        ],
      }),
    )
    .handler(async (event) =>
      controller.handler({
        body: event.body,
        headers: sanitizeObject(event.headers),
        params: sanitizeObject(event.pathParameters),
      }),
    );
}
