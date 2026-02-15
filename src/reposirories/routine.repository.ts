
import { prisma } from "src/lib/prisma"
import { RoutineMapper } from "src/mappers/routine.mapper"
import { RoutineDomain, RoutineModel } from "src/types/routine.type"

export interface IRoutineRepository {
    findByUserAndDayWithTasks(userId: string, date: Date): Promise<RoutineModel | null>
    findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null>
    create(date: Date, userId: string): Promise<RoutineModel>
    update(id: string, routine: Partial<RoutineDomain>): Promise<RoutineModel>
    findById(id: string, userId: string): Promise<RoutineModel | null>
    getRoutineTaskStats(routineId: string, userId: string): Promise<any>
    getCompletedTaskCount(routineId: string, userId: string): Promise<number>
    findAllByUser(userId: string): Promise<RoutineModel[]>
  
}


export const RoutineRepository = (): IRoutineRepository => {
    return {
        async findByUserAndDayWithTasks(userId: string, date: Date): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: {
                    userId, date
                },
                include: {
                    tasks: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            })
        },
        async findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: {
                    userId, date
                }
            })
        },
        async create(date: Date, userId: string): Promise<RoutineModel> {
            return await prisma.routine.create({
                data: {
                    date,
                    userId
                }
            })
        },
        async update(id: string, routine: Partial<RoutineDomain>): Promise<RoutineModel> {
            const persistenceData = RoutineMapper.domainToPersistence(routine);
            return await prisma.routine.update({
                where: { id },
                data: persistenceData,
                include: {
                    tasks: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            });
        },
        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            return await prisma.routine.findFirst({
                where: {
                    id, userId
                },
                include: {
                    tasks: {
                        orderBy: { createdAt: 'asc' }
                    }
                }
            })
        },
        async getRoutineTaskStats(routineId: string, userId: string) {
            return await prisma.task.aggregate({
                where: { routineId, userId },
                _count: {
                    _all: true
                },
                _sum: {
                    durationSec: true,
                    actualDurationSec: true
                }
            })
        },
        async getCompletedTaskCount(routineId: string, userId: string) {
            return await prisma.task.count({
                where: {
                    routineId,
                    userId,
                    status: "DONE"
                }
            })
        },
        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            return await prisma.routine.findMany({
                where: { userId },
                orderBy: { date: 'desc' }
            })
        },
        


    }

}