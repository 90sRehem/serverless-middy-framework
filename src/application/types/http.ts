export interface HttpRequest<T extends Record<string, any> | undefined> {
  body: T;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  pathParameters?: Record<string, string>;
}

export type HttpResponse = {
  statusCode: number;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
};
