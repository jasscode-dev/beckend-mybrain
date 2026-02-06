import { XP_CONFIG } from "@modules/metrics/domain";
import {  UserDomain, UserInput, UserResponse } from "./user.type";

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
        routines: [],
    })
},
addXp:(user:UserResponse, xpToAdd:number):UserResponse =>{
    if(xpToAdd <=0){
        return user;
    }
    let xp = user.xp + xpToAdd;
    let level = user.level;
    const xpPerLevel = XP_CONFIG.xpPerLevel;

    while(xp >=xpPerLevel){
        xp -= xpPerLevel;
        level++;
    }

    return Object.freeze({
        ...user,
        xp,
        level
    })
}
}