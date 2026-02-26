import { Request, Response } from "express";
import { UserMapper } from "src/mappers/user.mapper";
import { IUserRepository } from "src/reposirories/user.repository";
import { UserService } from "src/services/user.service";
import { LoginSchema } from "src/validators/auth.schema";
import { registerUserSchema } from "src/validators/user.schema";

export const AuthController = (userRepository: IUserRepository) => {
    const userService = UserService(userRepository);

    return {

        register: async (req: Request, res: Response) => {
            console.log(req.body)
            const data = registerUserSchema.parse(req.body)

            const userCreate = await userService.register(data)

            return res.status(201).json({
                error: null,
                data: {
                    user: UserMapper.toResponse(userCreate)
                }

            })




        },
        login: async (req: Request, res: Response) => {
            const data = LoginSchema.parse(req.body);

            const result = await userService.login(data);

            return res.status(200).json(
                {
                    error: null,
                    data: {
                        user: UserMapper.toResponse(result.user),
                        token: result.token
                    }
                }
            );
        },


        logout: async (req: Request, res: Response) => {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                await userService.logout(token);

            }

            res.json({ error: null, data: "Logout successful" })
        }
    }
        
    
    };
