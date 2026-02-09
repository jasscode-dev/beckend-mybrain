import { UserDomain } from "@modules/user/domain";
import { TaskXpInput, XP_CONFIG } from "./metrics.type";
import { TaskDomain } from "@modules/task/domain";

export const metricsDomain = {
    calculateTaskXP: (input: TaskXpInput): number => {

        if (input.status !== 'DONE') {
            return 0;
        }

        let xp = XP_CONFIG.baseTask;

        const onTime =
            !!input.finishedAt &&
            input.finishedAt <= input.plannedEnd;



        if (onTime) {
            xp += XP_CONFIG.onTimeBonus;
        }

        xp += XP_CONFIG.categoryBonus[input.category] ?? 0
        return xp;


    },
    totalXp(user: UserDomain) {
        return user.xp + (user.level - 1) * XP_CONFIG.xpPerLevel;
    },
    progressToNextLevel: (user: UserDomain) => {
        return XP_CONFIG.xpPerLevel - user.xp
    },
    



}