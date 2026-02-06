import { IRoutineRepository } from "@modules/routine/repositories"
import { ITaskRepository } from "@modules/task/repositories"
import { normalizeDate, taskDomain, TaskInput } from "@modules/task/domain"
import { RoutineService } from "@modules/routine/services/routine.service"


export const TaskService = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository
) => {

    const findById = async (id: string) => {
        const task = await taskRepository.findById(id)
        if (!task) throw new Error("Task not found")
        return task
    }

    return {
        create: async (input: TaskInput) => {
            const date = normalizeDate(input.plannedStart)

            const routine = await RoutineService(routineRepository)
                .create(input.userId, date)

            const task = taskDomain.create(input, routine.id)
            return await taskRepository.save(task)
        },

        start: async (id: string) => {
            const task = await findById(id)
            const updated = taskDomain.start(task)
            return await taskRepository.update(id, updated)
        },

        pause: async (id: string) => {
            const task = await findById(id)
            const updated = taskDomain.pause(task)
            return await taskRepository.update(id, updated)
        },

        done: async (id: string) => {
            const task = await findById(id)
            const updated = taskDomain.done(task)
            return await taskRepository.update(id, updated)
        },

        delete: async (id: string) => {
            const task = await findById(id)
            const updated = taskDomain.cancel(task)
            return await taskRepository.update(id,updated)
        },

        findAll: async () => {
            return await taskRepository.findAll()
        },

        findById
    }


}