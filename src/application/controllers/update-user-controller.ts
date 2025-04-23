import type { Controller } from "../types/controller";
import { HttpRequest, HttpResponse } from "../types/http";

export class UpdateUserController implements Controller {
  async handler({ params }: HttpRequest<undefined>): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        userId: params?.id,
        user: params?.id,
      },
    };
  }
}
