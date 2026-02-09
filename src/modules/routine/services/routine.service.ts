import { IRoutineRepository } from "@modules/routine/repositories";
import { ITaskRepository } from "@modules/task/repositories";

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

    const update = async (id: string, userId: string) => {
        const updated = await repository.update(id, userId)
        return updated
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
            const stats = await repository.getRoutineStats(routine.id, userId)
            if (stats.totalTasks === 0) return false
            if (stats.completedTasks !== stats.totalTasks) return false

            return await repository.makeDone(routine.id, userId)
        },

        startRoutine: async (routineId: string, userId: string) => {
            const routine = await findById(routineId, userId)
            if (routine.status !== 'PENDING') throw new Error("Routine cannot be started")
            return await repository.startProcessing(routine.id, userId)
        },

        failRoutine: async (routineId: string, userId: string) => {
            const routine = await findById(routineId, userId)
            if (routine.status === 'DONE' || routine.status === 'PARTIAL') {
                throw new Error("Routine is already finished")
            }
            return await repository.makeFailed(routine.id, userId)
        },

        findById,
        update,
    }
}