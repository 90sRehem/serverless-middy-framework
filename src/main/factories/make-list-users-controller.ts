import { ListUsersController } from "../../application/controllers/list-users-controller";

export function makeListUsersController() {
  return new ListUsersController();
}
