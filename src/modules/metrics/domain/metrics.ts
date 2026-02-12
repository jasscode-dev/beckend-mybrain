import { UserDomain } from "@modules/user/domain";
import { TaskXpInput, XP_CONFIG } from "./metrics.type";
import { TaskDomain } from "@modules/task/domain";

export const metricsDomain = {
    calculateTaskXP: (input: TaskXpInput): number => {

        if (input.status !== 'DONE') {
            return 0;
        }


        if (input.actualDurationSec === 0) {
            return 0;
        }

        const timeRatio = Math.min(input.actualDurationSec / input.durationSec, 1)

        let xp = Math.floor(XP_CONFIG.baseTask * timeRatio)

        xp += Math.floor((XP_CONFIG.categoryBonus[input.category] ?? 0) * timeRatio)

        const completedFullTime = input.actualDurationSec >= input.durationSec
        const onTime =
            completedFullTime &&
            !!input.finishedAt &&
            input.finishedAt <= input.plannedEnd;

        if (onTime) {
            xp += XP_CONFIG.onTimeBonus;
        }

        return xp;
    },
    totalXp(user: UserDomain) {
        return user.xp + (user.level - 1) * XP_CONFIG.xpPerLevel;
    },
    progressToNextLevel: (user: UserDomain) => {
        return XP_CONFIG.xpPerLevel - user.xp
    },




}