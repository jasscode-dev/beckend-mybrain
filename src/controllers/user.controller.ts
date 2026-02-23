
import {Response, Request} from "express"
import { UserMapper } from "src/mappers/user.mapper";
import { IUserRepository } from "src/reposirories/user.repository";
import { UserService } from "src/services/user.service";
import { registerUserSchema } from "src/validators/user.schema";


export const UserController = (
    userRepository: IUserRepository
) => {
    const userService = UserService(userRepository)
   
    return {
        
     register: async (req:Request, res:Response)=>{

        const data = registerUserSchema.parse(req.body)

        const userCreate = await userService.register(data)

       return  res.status(201).json(UserMapper.toResponse(userCreate))
        



     }
}
}