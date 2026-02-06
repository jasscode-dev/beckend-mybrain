import { RoutineResponse } from "@modules/routine/domain";

export interface UserDomain extends UserInput {
   level: number;
   xp: number;
   stars: number;
   tulips: number;
   routines:RoutineResponse[]

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


export interface UserResponse extends UserDomain{
    userId: string;
}
