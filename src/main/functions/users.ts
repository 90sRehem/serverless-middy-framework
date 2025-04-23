import { makeFindUserPostController } from "../factories/make-find-user-post-controller";
import { makeListUserPostsController } from "../factories/make-list-user-posts-controller";
import { makeListUsersController } from "../factories/make-list-users-controller";
import { makeUpdateUserController } from "../factories/make-update-users-controller";
import { makeHandler } from "../middy/make-handler";
import { makeRoutesHandler } from "../middy/make-routes-handler";

export const handler = makeRoutesHandler([
  {
    path: "/users",
    method: "GET",
    handler: makeHandler(makeListUsersController()),
  },
  {
    path: "/users/{id}",
    method: "PUT",
    handler: makeHandler(makeUpdateUserController()),
  },
  {
    path: "/users/{id}/posts",
    method: "GET",
    handler: makeHandler(makeListUserPostsController()),
  },
  {
    path: "/users/{id}/posts/{postId}",
    method: "GET",
    handler: makeHandler(makeFindUserPostController()),
  },
]);
