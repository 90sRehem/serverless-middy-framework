import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpMultipartBodyParser from "@middy/http-multipart-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";

import { Controller } from "../../application/types/controller";
import { sanitizeObject } from "../utils/sanitize-object";
import { errorHandler } from "./middlewares/error-handler";

export function makeHandlerWithMultipart(controller: Controller<any>) {
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
            serializer: ({ body }) => {
              if (typeof body === "object" && body.url) {
                body.url = decodeURIComponent(body.url);
              }
              return JSON.stringify(body);
            },
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
