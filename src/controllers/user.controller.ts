
import { Response, Request } from "express"
import { UserMapper } from "src/mappers/user.mapper";
import { IUserRepository } from "src/reposirories/user.repository";
import { UserService } from "src/services/user.service";



export const UserController = (
  userRepository: IUserRepository
) => {
  const userService = UserService(userRepository)

  return {


    getMe: async (req: Request, res: Response) => {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized", data: null });
      }
      const user = await userService.findById(req.user.id);

      return res.status(200).json({
        error: null,
          user: UserMapper.toResponse(user)
        
      });

    }

  }


}

