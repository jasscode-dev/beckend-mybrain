
import { UserModel } from "src/types/user.type";

export const UserMapper = {
    toResponse(user: UserModel) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdm: user.isAdm,
            level: user.level,
            xp: user.xp,
            stars: user.stars,
            tulips: user.tulips




        }
    },

}