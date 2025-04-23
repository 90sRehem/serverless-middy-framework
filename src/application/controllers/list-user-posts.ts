import type { Controller } from "../types/controller";
import { HttpRequest, HttpResponse } from "../types/http";

export class ListUserPostsController implements Controller {
  async handler({ params }: HttpRequest<undefined>): Promise<HttpResponse> {
    return {
      statusCode: 200,
      body: {
        userId: params?.id,
        posts: [
          {
            id: "1",
            title: "Post 1",
            content: "Content of post 1",
          },
          {
            id: "2",
            title: "Post 2",
            content: "Content of post 2",
          },
        ],
      },
    };
  }
}
