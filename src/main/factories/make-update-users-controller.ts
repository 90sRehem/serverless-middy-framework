import { UpdateUserController } from "../../application/controllers/update-user-controller";

export function makeUpdateUserController() {
  return new UpdateUserController();
}
