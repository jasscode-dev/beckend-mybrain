import { UserDomain, UserInput, XP_CONFIG, TaskXpInput } from "./user.type";

export const userDomain = {
    create: (input: UserInput): UserDomain => {
        if (!input.name || input.name.trim().length < 2) {
            throw new Error("Name must have at least 2 characters")
        }
        if (!input.email || input.email.trim().length < 2) {
            throw new Error("Email must have at least 2 characters")
        }
        if (!input.password || input.password.trim().length < 2) {
            throw new Error("Password must have at least 2 characters")
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
    addStar: (user: UserDomain): UserDomain => {

        const updated = {
            ...user,
            stars: user.stars + 1
        }

        return Object.freeze(updated)
    },
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