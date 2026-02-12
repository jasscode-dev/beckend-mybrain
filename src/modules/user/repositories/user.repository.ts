import { prisma } from "src/lib/prisma";
import { UserDomain, UserModel } from "@modules/user/domain";
import { IUserRepository } from "./user.interface";

export const UserRepository = (): IUserRepository => {
    return {
        async save(user: UserDomain): Promise<UserModel> {
            return await prisma.user.create({
                data: {
                    ...user

                },
            });

        },

        async update(user: UserDomain, userId: string): Promise<UserModel> {
            return await prisma.user.update({
                where: { id: userId },
                data: {
                    ...user,
                    updatedAt: new Date()
                },

            });


        },

        async findById(userId: string): Promise<UserModel | null> {
            return prisma.user.findUnique({
                where: { id: userId },

            });


        }
    };
};
