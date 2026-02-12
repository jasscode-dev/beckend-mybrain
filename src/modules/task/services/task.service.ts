import { IRoutineRepository } from "@modules/routine/repositories"
import { ITaskRepository } from "@modules/task/repositories"
import { normalizeDate, taskDomain, TaskInput } from "@modules/task/domain"
import { RoutineService } from "@modules/routine/services/routine.service"
import { IUserRepository } from "@modules/user/repositories"
import { UserService } from "@modules/user/service/user.service"
import { metricsDomain } from "@modules/metrics/domain"
import { TaskMapper } from "../domain/task.mapper"

export const TaskService = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository,
    userRepository: IUserRepository,
) => {

    const findById = async (id: string, userId: string) => {
        const task = await taskRepository.findById(id, userId)
        if (!task) throw new Error("Task not found")
        return task
    }


    const routineService = RoutineService(routineRepository, taskRepository)
    const userService = UserService(userRepository)

    return {
        create: async (input: TaskInput, userId: string) => {
            const date = normalizeDate(input.plannedStart)
            console.log(date)
            console.log(input.plannedStart)

            const routine = await routineService.getOrCreateDailyRoutine(userId, date)
            const statsdata = await routineService.getStatsByRoutine(routine.id, userId)
            const task = await taskRepository.save(taskDomain.create(input, routine.id), userId)
            console.log(statsdata)
            const statusUpdated = { ...statsdata, totalTasks: statsdata.totalTasks + 1 }
            console.log(statusUpdated)
            return {
                task,
                stats: statusUpdated
            }
        },

        start: async (id: string, userId: string) => {
            const now = new Date()


            const task = await findById(id, userId)

            const tasks = await taskRepository.findAllByRoutineId(task.routineId, userId)

            const inProgressTasks = tasks.filter(t => t.status === "INPROGRESS")

            if (inProgressTasks.length > 0) {
                for (const inProgressTask of inProgressTasks) {
                    await taskRepository.update(inProgressTask.id,
                        taskDomain.pause(TaskMapper.toDomain(inProgressTask), now), userId)
                }
            }
            const updated = taskDomain.start(TaskMapper.toDomain(task), now)

            await routineService.startRoutine(task.routineId, userId)
            const stats = await routineService.getStatsByRoutine(task.routineId, userId)
            const savedTask = await taskRepository.update(id, updated, userId)
            console.log(savedTask)
            return {
                task: savedTask,
                stats
            }
        },

        pause: async (id: string, userId: string) => {
            const now = new Date()
            const task = await findById(id, userId)

            const updated = taskDomain.pause(TaskMapper.toDomain(task), now)

            return await taskRepository.update(id, updated, userId)
        },

        done: async (id: string, userId: string) => {
            const now = new Date()

            const task = await findById(id, userId)

            const updatedTask = taskDomain.done(TaskMapper.toDomain(task), now)

            const savedTask = await taskRepository.update(id, updatedTask, userId)

            const routineCompleted = await routineService.checkRoutineCompleted(task.routineId, userId)

            if (routineCompleted) {
                await userService.addStar(userId)
            }

            const xp = metricsDomain.calculateTaskXP({
                status: updatedTask.status,
                plannedEnd: updatedTask.plannedEnd,
                finishedAt: updatedTask.finishedAt,
                category: updatedTask.category,
                actualDurationSec: updatedTask.actualDurationSec,
                durationSec: updatedTask.durationSec
            })
            await userService.addXp(userId, xp)
            const stats = await routineService.getStatsByRoutine(task.routineId, userId)

            return {
                task: savedTask,
                stats
            }
        },

        delete: async (id: string, userId: string) => {
            const now = new Date()
            const task = await findById(id, userId)

            const updated = taskDomain.cancel(TaskMapper.toDomain(task), now)
            return await taskRepository.update(id, updated, userId)
        },

        findAll: async (userId: string) => {
            const tasks = await taskRepository.findAll(userId)
            return tasks.map(TaskMapper.toResponse)
        },


        findById
    }
}
