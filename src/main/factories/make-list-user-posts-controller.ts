import { ListUserPostsController } from "../../application/controllers/list-user-posts";

export function makeListUserPostsController() {
  return new ListUserPostsController();
}
