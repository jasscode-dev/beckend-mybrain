import { AppError } from "src/errors/appError"
import { RoutineStatus } from "src/generated/prisma"
import { TaskXpInput, UserDomain, UserInput, XP_CONFIG } from "src/types/user.type"


export const User = {
    create: (input: UserInput): UserDomain => {
        if (!input.name || input.name.trim().length < 2) {
            throw new AppError("Name must have at least 2 characters")
        }
        if (!input.email || input.email.trim().length < 2) {
            throw new AppError("Email must have at least 2 characters")
        }
        if (!input.password || input.password.trim().length < 2) {
            throw new AppError("Password must have at least 2 characters")
        }
        return Object.freeze({
            name: input.name,
            email: input.email,
            password: input.password,
            level: 1,
            xp: 0,
            stars: 0,
            tulips: 0,
        })
    },
    addXp: (user: UserDomain, xpToAdd: number): UserDomain => {
        if (xpToAdd <= 0) {
            return user;
        }
        let xp = user.xp + xpToAdd;
        let level = user.level;
        const xpPerLevel = XP_CONFIG.xpPerLevel;

        while (xp >= xpPerLevel) {
            xp -= xpPerLevel;
            level++;
        }

        return Object.freeze({
            ...user,
            xp,
            level
        })
    },
    addStar: (routineStatus: RoutineStatus, user: UserDomain): UserDomain => {

        if (routineStatus != 'COMPLETED') {
            return Object.freeze(user)
        }

        const updated = {
            ...user,
            stars: user.stars + 1
        }

        return Object.freeze(updated)
    },
    removeStar: (user: UserDomain): UserDomain => {
        if (user.stars <= 0) {
            return Object.freeze(user)
        }

        const updated = {
            ...user,
            stars: user.stars - 1
        }

        return Object.freeze(updated)
    },
    

    calculateTaskXP: (input: TaskXpInput): { xp: number; reason: string } => {

        if (input.status !== 'DONE') {
            return { xp: 0, reason: 'Task was not completed' };
        }


        if (input.actualDurationSec === 0) {
            return { xp: 0, reason: 'No time was tracked for this task' };
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

        // Generate explanatory message
        const percentage = Math.round(timeRatio * 100);
        let reason = `${percentage}% of planned time worked`;
        
        if (percentage < 100) {
            reason += ` (completed before planned time)`;
        } else if (onTime) {
            reason += ` + on-time bonus`;
        }
        
        if (XP_CONFIG.categoryBonus[input.category] > 0) {
            reason += ` + ${input.category} bonus`;
        }

        return { xp, reason };
    },
    
    totalXp(user: UserDomain) {
        return user.xp + (user.level - 1) * XP_CONFIG.xpPerLevel;
    },
    progressToNextLevel: (user: UserDomain) => {
        return XP_CONFIG.xpPerLevel - user.xp
    },

}