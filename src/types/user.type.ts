
import { Category, StatusTask } from "./task.type";


export const XP_CONFIG = {
    baseTask: 12,
    onTimeBonus: 5,
    categoryBonus: {
        WORK: 2,
        STUDY: 3,
        BREAK: 0,
        PERSONAL: 1,

    },
    xpPerLevel: 200

}

export interface TaskXpInput {
    status: StatusTask;
    category: Category;
    plannedEnd: Date;
    finishedAt: Date | null;
    actualDurationSec: number;
    durationSec: number;
}

export interface UserDomain extends UserInput {
    level: number;
    xp: number;
    stars: number;
    tulips: number;

}

export interface UserInput {
    name: string;
    email: string;
    password: string;
}

export interface LoginUserInput {
    email: string;
    password: string;
}


export interface UserModel extends UserDomain {
    id: string;
    name: string;
    email: string;
    isAdm: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

