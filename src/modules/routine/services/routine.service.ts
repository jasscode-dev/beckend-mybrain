import { IRoutineRepository } from "@modules/routine/repositories";
import { ITaskRepository } from "@modules/task/repositories";
import { taskDomain, TaskMapper } from "@modules/task/domain";

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



        findById,
    }
}
