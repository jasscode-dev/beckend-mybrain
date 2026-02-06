import { UserResponse } from "@modules/user/domain"
import { IUserRepository } from "@modules/user/repositories";

export const InMemoryUserRepository = (initialUsers: UserResponse[] =[]): IUserRepository => {
    const users = [...initialUsers];

    return {
        async addXp(user: UserResponse): Promise<UserResponse> {
            const userExist = users.findIndex(u => u.userId === user.userId);   

            if (userExist === -1) {
                throw new Error("User not found");
            }

            const updatedUser = {
                ...users[userExist],
                xp: users[userExist].xp + user.xp
            };

            const index = users.findIndex(u => u.userId === user.userId);
            users[index] = updatedUser;

            return updatedUser;
        },
        async update(user: UserResponse): Promise<UserResponse> {
            const userExist = users.findIndex(u => u.userId === user.userId);    
            if (userExist === -1) {
                throw new Error("User not found");
            }
            users[userExist] = user;
            return user;
        },
        async findById(id: string): Promise<UserResponse | null> {
            const user = users.find(u => u.userId === id);
            return user || null;
        }       
    }
}