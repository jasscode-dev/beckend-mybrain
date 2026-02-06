import { IRoutineRepository } from "@modules/routine/repositories"
import { ITaskRepository } from "@modules/task/repositories"
import { normalizeDate, taskDomain, TaskInput } from "@modules/task/domain"
import { RoutineService } from "@modules/routine/services/routine.service"
import { IUserRepository } from "@modules/user/repositories"
import { userDomain } from "@modules/user/domain"
import { UserService } from "@modules/user/service/user.service"
import { metricsDomain } from "@modules/metrics/domain"



export const TaskService = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository,
    userRepository: IUserRepository
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
            const updatedTask = taskDomain.done(task)
            const savedTask = await taskRepository.update(id, updatedTask)

            const xp = metricsDomain.calculateTaskXP({
                status: updatedTask.status,
                plannedEnd: updatedTask.plannedEnd,
                finishedAt: updatedTask.finishedAt,
                category: updatedTask.category
            })  

            await UserService(userRepository).addXp(savedTask.userId, xp)
            return savedTask
        },

        delete: async (id: string) => {
            const task = await findById(id)
            const updated = taskDomain.cancel(task)
            return await taskRepository.update(id, updated)
        },

        findAll: async () => {
            return await taskRepository.findAll()
        },

        findById
    }


}