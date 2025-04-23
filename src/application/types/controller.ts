import type { HttpRequest, HttpResponse } from "./http";

export interface Controller<
  T extends Record<string, any> | undefined = undefined,
> {
  handler(request: HttpRequest<T>): Promise<HttpResponse>;
}
