import { Request, Response } from "express";
import { IUserRepository } from "src/modules/user/repositories";
import { UserService } from "../service/user.service";
import { UserMapper } from "../domain/user.mapper";

export const UserController = (userRepository: IUserRepository) => {
    const userService = UserService(userRepository);
    return {
        get: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"; // TODO: get from token
            const user = await userService.findById(userId);
            console.log(user)
            return res.status(200).json(UserMapper.toResponse(user));
        }
    };
};
