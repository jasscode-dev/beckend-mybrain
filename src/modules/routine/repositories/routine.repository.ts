import { prisma } from "src/lib/prisma";
import { RoutineHighlights, RoutineModel, RoutineStats } from "../types/routine.types";
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

        async findByUserAndDayWithTasks(userId: string, date: Date): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: {
                    userId,
                    date
                },
                include: {
                    tasks: true
                }
            })
        },

        async findByUserAndMonth(userId: string, year: number, month: number): Promise<RoutineModel[]> {
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

            return await prisma.routine.findMany({
                where: {
                    userId,
                    date: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                },
                orderBy: { date: 'asc' }
            }) as RoutineModel[];
        },

        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            return await prisma.routine.findMany({
                where: { userId },
                orderBy: { date: 'desc' }
            });
        },

        async findByUserAndRange(userId: string, start: Date, end: Date): Promise<RoutineModel[]> {
            return await prisma.routine.findMany({
                where: {
                    userId,
                    date: {
                        gte: start,
                        lte: end
                    }
                },
                orderBy: { date: 'asc' }
            }) as RoutineModel[];
        },

        async getHighlights(userId: string, start: Date, end: Date): Promise<RoutineHighlights> {
            const counts = await prisma.routine.groupBy({
                by: ['status'],
                where: {
                    userId,
                    date: { gte: start, lte: end }
                },
                _count: true
            });

            const perfectDays = counts.find(c => c.status === 'DONE')?._count || 0;
            const incompleteDays = counts.find(c => c.status === 'INCOMPLETE')?._count || 0;

            // Para o dia da semana, usamos raw SQL pois o Prisma não suporta strftime no groupBy nativamente para SQLite
            const dailyStatsRaw: any[] = await prisma.$queryRaw`
                SELECT 
                    CAST(strftime('%w', date / 1000, 'unixepoch') AS INTEGER) as day,
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END) as done
                FROM Routine
                WHERE userId = ${userId} AND date >= ${start.getTime()} AND date <= ${end.getTime()}
                GROUP BY day
            `;

            const dailyPercentages = dailyStatsRaw.map(s => ({
                day: Number(s.day),
                percentage: s.total > 0 ? (Number(s.done) / Number(s.total)) * 100 : 0
            }));

            return {
                perfectDays,
                incompleteDays,
                dailyPercentages
            };
        },

        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: { id, userId }
            });

        },

        async getRoutineTaskStats(routineId: string, userId: string) {
            return prisma.task.aggregate({
                where: { routineId, userId },
                _count: { _all: true },
                _sum: {
                    durationSec: true,
                    actualDurationSec: true,
                },
            });
        },

        async getCompletedTaskCount(routineId: string, userId: string) {
            return prisma.task.count({
                where: {
                    routineId,
                    userId,
                    status: 'DONE'
                }
            });
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
