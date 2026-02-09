import { RoutineModel } from "@modules/routine/domain";

export interface UserDomain extends UserInput {
    level: number;
    xp: number;
    stars: number;
    tulips: number;
    routines: RoutineModel[]

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
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
