import { XP_CONFIG } from "@modules/metrics/domain"
import { UserModel } from "./user.type"

export const UserMapper = {
    toResponse: (user: UserModel) => {
        return {
            name: user.name,
            level: user.level,
            xp: user.xp,
            xpMax: XP_CONFIG.xpPerLevel,
            stars: user.stars,
            tulips: user.tulips
        }
    }
}