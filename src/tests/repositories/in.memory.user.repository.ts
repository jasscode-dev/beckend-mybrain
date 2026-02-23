import { IUserRepository } from "src/reposirories/user.repository";
import { UserModel } from "src/types/user.type";
import { UserDomain } from "src/types/user.type";




export const InMemoryUserRepository = (initialUsers: UserModel[] = []): IUserRepository => {
    const users = [...initialUsers];

    return {

        async update(user: UserDomain, userId: string): Promise<UserModel> {
            const index = users.findIndex(u => u.id === userId);

            if (index === -1) {
                throw new Error("User not found");
            }

            const updatedUser = {
                ...users[index],
                ...user,
                updatedAt: new Date()
            } as UserModel;
            users[index] = updatedUser;
            return updatedUser;


        },
        async findById(userId: string): Promise<UserModel | null> {
            const user = users.find(u => u.id === userId);
            return user || null;
        },

        async save(user: UserDomain): Promise<UserModel> {
            const createdUser: UserModel = {
                id: crypto.randomUUID(),
                name: user.name,
                email: user.email,
                password: user.password,
                xp: 0,
                level: 1,
                stars: 0,
                tulips: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
            users.push(createdUser);
            return createdUser;
        }


    }
}