import { IRoutineRepository } from "@modules/routine/repositories";
import { ITaskRepository } from "@modules/task/repositories";
import { normalizeDate, taskDomain, TaskMapper } from "@modules/task/domain";

export const RoutineService = (
    repository: IRoutineRepository,
    taskRepository: ITaskRepository
) => {

    const findById = async (id: string, userId: string) => {
        const routine = await repository.findById(id, userId)
        if (!routine) throw new Error("Routine not found")
        if (routine.userId !== userId) throw new Error("Unauthorized")
        return routine
    }

    const getStatsByRoutine = async (routineId: string, userId: string) => {
        const routine = await findById(routineId, userId)
        const [stats, completedCount] = await Promise.all([
            repository.getRoutineTaskStats(routine.id, userId),
            repository.getCompletedTaskCount(routine.id, userId)
        ]);

        const totalTasks = stats._count._all;
        const totalSecondsPlanned = stats._sum.durationSec || 0;
        const completedSeconds = stats._sum.actualDurationSec || 0;

        const completionRate = totalTasks > 0
            ? Math.round((completedCount / totalTasks) * 100)
            : 0;

        return {
            totalTasks,
            completedTasks: completedCount,
            completionRate,
            totalSecondsPlanned,
            completedSeconds
        };

    }

    return {
        getOrCreateDailyRoutine: async (userId: string, date: Date) => {
            const existingRoutine = await repository.findByUserAndDay(userId, date);
            if (existingRoutine) return existingRoutine
            return await repository.save(date, userId);
        },

        findAllByUser: async (userId: string) => {
            return await repository.findAllByUser(userId)
        },

        checkRoutineCompleted: async (routineId: string, userId: string) => {
            const routine = await findById(routineId, userId)
            const stats = await getStatsByRoutine(routineId, userId)

            if (stats.totalTasks === 0) return null
            if (stats.completedTasks !== stats.totalTasks) return null


            if (routine.status === 'DONE' || routine.status === 'INCOMPLETE') {
                return null
            }

            return await repository.update(routine.id, userId, {
                status: 'DONE',
                finishedAt: new Date()
            })
        },

        startRoutine: async (routineId: string, userId: string) => {
            const routine = await findById(routineId, userId)

            if (routine.status !== 'INPROGRESS' && routine.status !== 'INCOMPLETE') {
                return await repository.update(routine.id, userId, {
                    status: 'INPROGRESS',
                    startedAt: new Date()
                })
            }

            return routine
        },

        getStatsByPeriod: async (userId: string, period: 'day' | 'week' | 'month' | 'all') => {
            const now = new Date();
            let start: Date;
            let end: Date = now;

            switch (period) {
                case 'day':
                    start = normalizeDate(now);
                    end = new Date(start);
                    end.setUTCHours(23, 59, 59, 999);
                    break;
                case 'week':
                    start = normalizeDate(now);
                    start.setUTCDate(start.getUTCDate() - start.getUTCDay());
                    end = new Date(start);
                    end.setUTCDate(start.getUTCDate() + 6);
                    end.setUTCHours(23, 59, 59, 999);
                    break;
                case 'month':
                    start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
                    end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
                    break;
                case 'all':
                default:
                    start = new Date(0);
                    break;
            }

            return await repository.getHighlights(userId, start, end);
        },

        getRoutineByDay: async (userId: string, date: Date) => {
            const routine = await repository.findByUserAndDayWithTasks(userId, date);
            if (!routine) return null
            if (routine.userId !== userId) throw new Error("Unauthorized")
            return routine;
        },
        getRoutineToday: async (userId: string) => {
            const date = normalizeDate(new Date())
            const routine = await repository.findByUserAndDayWithTasks(userId, date);
            if (!routine) return null
            if (routine.userId !== userId) throw new Error("Unauthorized")
            const stats = await getStatsByRoutine(routine.id, userId)
            return { routine, stats };
        },





        findById,
        getStatsByRoutine
    }
}
