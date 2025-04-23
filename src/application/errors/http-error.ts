export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message?: Record<string, unknown>,
  ) {
    super(JSON.stringify(message));
    this.name = "HttpError";
  }
}
