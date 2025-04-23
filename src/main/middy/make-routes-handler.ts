import middy from "@middy/core";
import httpRouter, { Route } from "@middy/http-router";
import { errorHandler } from "./middlewares/error-handler";

export function makeRoutesHandler(routes: Route<any, any>[]) {
  return middy().use(errorHandler()).handler(httpRouter(routes));
}
