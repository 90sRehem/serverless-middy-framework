import type { Controller } from "../types/controller";
import { HttpRequest, HttpResponse } from "../types/http";

export class FindUserPostController implements Controller {
  async handler({ params }: HttpRequest<undefined>): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        userId: params?.id,
        posts: {
          id: "1",
          title: "Post 1",
          content: "Content of post 1",
        },
      },
    };
  }
}
