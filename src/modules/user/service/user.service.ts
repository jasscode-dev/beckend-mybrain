import { IUserRepository } from "@modules/user/repositories";
import { userDomain, UserDomain, UserModel } from "@modules/user/domain";
import { XP_CONFIG } from "@modules/metrics/domain";

export const UserService = (
    userRepository: IUserRepository) => {

    const findById = async (id: string) => {
        const user = await userRepository.findById(id)
        if (!user) throw new Error("User not found")
        if (user.id != id) throw new Error("User not authorized")

        return user
    }

    return {

        addXp: async (userId: string, xpToAdd: number) => {
            const userFind = await findById(userId)
            const updatedUser = userDomain.addXp(userFind, xpToAdd)
            return await userRepository.update(updatedUser, userId)
        },
        save: async (user: UserDomain) => {
            return await userRepository.save(user)

        },
        findById,
        addStar: async (userId: string) => {
            const userFind = await findById(userId)
            const updatedUser = userDomain.addStar(userFind)
            return await userRepository.update(updatedUser, userId)

        },

    }

}