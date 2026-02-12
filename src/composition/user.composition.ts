import { UserController } from "@modules/user/controllers/user.controller";
import { UserRepository } from "@modules/user/repositories";

export const userController = UserController(UserRepository());
