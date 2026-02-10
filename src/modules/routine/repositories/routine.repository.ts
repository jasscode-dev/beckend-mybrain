import { prisma } from "@/lib/prisma";
import { RoutineModel, RoutineStats } from "../types/routine.types";
import { IRoutineRepository } from "./routine.interface";

export const RoutineRepository = (): IRoutineRepository => {
    return {
        async save(date: Date, userId: string): Promise<RoutineModel> {
            return await prisma.routine.create({
                data: {
                    userId,
                    date,
                }
            });

        },

        async findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: {
                    userId,
                    date
                }
            });


        },

        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            return await prisma.routine.findMany({
                where: { userId },
                orderBy: { date: 'desc' }
            });


        },

        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: { id, userId }
            });

        },

        async getRoutineStats(routineId: string, userId: string): Promise<RoutineStats> {
            const tasks = await prisma.task.findMany({
                where: {
                    routineId,
                    routine: { userId }
                }
            });

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter((t: any) => t.status === 'DONE').length;
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            const totalSecondsPlanned = tasks.reduce((sum: number, t: any) => sum + t.durationSec, 0);
            const completedSeconds = tasks
                .filter((t: any) => t.status === 'DONE')
                .reduce((sum: number, t: any) => sum + t.actualDurationSec, 0);

            return {
                totalTasks,
                completedTasks,
                completionRate,
                totalSecondsPlanned,
                completedSeconds
            };
        },

        async update(id: string, userId: string, data: Partial<Omit<RoutineModel, 'id' | 'userId' | 'createdAt' | 'tasks'>>): Promise<RoutineModel> {
            return await prisma.routine.update({
                where: { id, userId },
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            });


        }
    };
};
