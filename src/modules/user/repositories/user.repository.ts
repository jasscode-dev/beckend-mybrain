import { prisma } from "@/lib/prisma";
import { UserDomain, UserModel } from "@modules/user/domain";
import { IUserRepository } from "./user.interface";

export const UserRepository = (): IUserRepository => {
    return {
        async save(user: UserDomain): Promise<UserModel> {
            const created = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    level: user.level || 1,
                    xp: user.xp || 0,
                    stars: user.stars || 0,
                }
            });

            return {
                userId: created.id,
                name: created.name,
                email: created.email,
                password: created.password,
                level: created.level,
                xp: created.xp,
                stars: created.stars,
                tulips: 0,
                routines: [],
                createdAt: created.createdAt,
                updatedAt: created.updatedAt
            } as UserModel;
        },

        async update(user: UserDomain, userId: string): Promise<UserModel> {
            const updated = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: user.name,
                    email: user.email,
                    level: user.level,
                    xp: user.xp,
                    stars: user.stars,
                }
            });

            return {
                userId: updated.id,
                name: updated.name,
                email: updated.email,
                password: updated.password,
                level: updated.level,
                xp: updated.xp,
                stars: updated.stars,
                tulips: 0,
                routines: [],
                createdAt: updated.createdAt,
                updatedAt: updated.updatedAt
            } as UserModel;
        },

        async findById(userId: string): Promise<UserModel | null> {
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) return null;

            return {
                userId: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                level: user.level,
                xp: user.xp,
                stars: user.stars,
                tulips: 0,
                routines: [],
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            } as UserModel;
        }
    };
};
