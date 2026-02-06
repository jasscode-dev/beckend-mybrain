import { UserDomain, UserResponse } from "@modules/user/domain";


export interface IUserRepository {
    addXp(user:UserResponse): Promise<UserResponse>;
    update(user: UserResponse): Promise<UserResponse>;
    findById(id: string): Promise<UserResponse | null>;
}