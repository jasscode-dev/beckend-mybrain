import { AuthController } from "src/controllers/auth.controller";
import { UserRepository } from "src/reposirories/user.repository";

export const authController = AuthController(UserRepository());
