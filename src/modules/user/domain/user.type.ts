import { RoutineModel } from "@modules/routine/types/routine.types";

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
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
