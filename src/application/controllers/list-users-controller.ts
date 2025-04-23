import type { Controller } from "../types/controller";
import { HttpRequest, HttpResponse } from "../types/http";

type ListUsersRequest = {
  userId: string;
};

export class ListUsersController implements Controller {
  async handler(request: HttpRequest<undefined>): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        users: ["Alice", "Bob", "Charlie"],
      },
    };
  }
}
