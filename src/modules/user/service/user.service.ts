import { IUserRepository } from "@modules/user/repositories";
import { userDomain, UserDomain, UserResponse } from "@modules/user/domain";

export const UserService =(
    userRepository: IUserRepository)=> {
        
    const findById = async (id: string) => {
        const user = await userRepository.findById(id)
        if (!user) throw new Error("User not found")
        return user
    }

return{

    addXp: async (userId: string, xpToAdd: number) => {
        const userFind = await findById(userId)
        const updatedUser = userDomain.addXp(userFind, xpToAdd)     
        return await userRepository.update(updatedUser)
        
      },
      findById
  } 
  
}