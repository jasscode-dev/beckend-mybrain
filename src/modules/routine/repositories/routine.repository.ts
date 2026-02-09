import { prisma } from "@/lib/prisma";
import { RoutineModel, RoutineStats } from "../types/routine.types";
import { IRoutineRepository } from "./routine.interface";

export const RoutineRepository = (): IRoutineRepository => {
    return {
        async save(date: Date, userId: string): Promise<RoutineModel> {
            const created = await prisma.routine.create({
                data: {
                    userId,
                    date,
                    status: 'PENDING',
                }
            });

            return created as RoutineModel;
        },

        async findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null> {
            const routine = await prisma.routine.findFirst({
                where: {
                    userId,
                    date
                }
            });

            return routine as RoutineModel | null;
        },

        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            const routines = await prisma.routine.findMany({
                where: { userId },
                orderBy: { date: 'desc' }
            });

            return routines as RoutineModel[];
        },

        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            const routine = await prisma.routine.findFirst({
                where: { id, userId }
            });

            return routine as RoutineModel | null;
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

        async update(id: string, userId: string): Promise<RoutineModel> {
            const updated = await prisma.routine.update({
                where: { id },
                data: { updatedAt: new Date() }
            });

            return updated as RoutineModel;
        },

        async makeDone(id: string, userId: string): Promise<boolean> {

            const result = await prisma.routine.updateMany({
                where: {
                    id,
                    userId,
                    status: { notIn: ['DONE', 'PARTIAL'] }
                },
                data: {
                    status: 'DONE',
                    updatedAt: new Date()
                }
            });

            return result.count === 1;
        },

        async startProcessing(id: string, userId: string): Promise<boolean> {
            // Only allow transition to INPROGRESS from PENDING
            const result = await prisma.routine.updateMany({
                where: {
                    id,
                    userId,
                    status: 'PENDING'
                },
                data: {
                    status: 'INPROGRESS',
                    updatedAt: new Date()
                }
            });

            return result.count === 1;
        },

        async makeFailed(id: string, userId: string): Promise<boolean> {
            // Only allow transition to PARTIAL if not already finished
            const result = await prisma.routine.updateMany({
                where: {
                    id,
                    userId,
                    status: { notIn: ['DONE', 'PARTIAL'] }
                },
                data: {
                    status: 'PARTIAL',
                    updatedAt: new Date()
                }
            });

            return result.count === 1;
        }
    };
};
