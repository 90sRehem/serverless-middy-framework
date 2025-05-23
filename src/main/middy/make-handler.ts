import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpResponseSerializer from "@middy/http-response-serializer";

import { Controller } from "../../application/types/controller";
import { sanitizeObject } from "../utils/sanitize-object";
import { errorHandler } from "./middlewares/error-handler";

export function makeHandler(controller: Controller<any>) {
  return middy()
    .use(httpJsonBodyParser({ disableContentTypeError: true }))
    .use(errorHandler())
    .use(
      httpResponseSerializer({
        defaultContentType: "application/json",
        serializers: [
          {
            regex: /^application\/json$/,
            serializer: ({ body }) => {
              if (typeof body === "object" && body.url) {
                body.url = decodeURIComponent(body.url); // Decodifica antes de serializar
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
