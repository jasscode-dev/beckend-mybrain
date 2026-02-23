
import { Task } from "src/domain/task";
import { ITaskRepository } from "src/reposirories/task.repository";
import { RoutineService } from "./routine.service";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { IUserRepository } from "src/reposirories/user.repository";
import { UserService } from "./user.service";
import { AppError } from "src/errors/appError";

export const TaskService = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository,
    userRepository: IUserRepository
) => {
    const routineService = RoutineService(routineRepository, taskRepository, userRepository)
    const userService = UserService(userRepository)



    const start = async (taskId: string, userId: string) => {
        const rawTask = await findById(taskId, userId)
        const date = new Date()
        const updatedTask = await taskRepository.
            update(
                Task.start(rawTask, date),
                userId,
                rawTask.id

            )

        const routine = await routineService.start(updatedTask.routineId, userId)

        const stats = await routineService.getStatsByRoutine(updatedTask.routineId, userId)

        return {
            routine,
            stats
        }
    }
    const pause = async (taskId: string, userId: string) => {
        const rawTask = await findById(taskId, userId)
        const date = new Date()
        const updatedTask = await taskRepository.
            update(
                Task.pause(rawTask, date),
                userId,
                rawTask.id

            )
        const routine = await routineService.findById(updatedTask.routineId, userId)
        const stats = await routineService.getStatsByRoutine(updatedTask.routineId, userId)
        return {
            routine,
            stats
        }
    }
    const done = async (taskId: string, userId: string) => {
        const rawTask = await findById(taskId, userId)
        const now = new Date()
        const taskDomain = Task.done(rawTask, now)

        const updatedTask = await taskRepository.
            update(
                taskDomain,
                userId,
                rawTask.id

            )
        const userXp = await userService.processTaskReward(userId, updatedTask)

        const routine = await routineService.completedRoutine(updatedTask.routineId, userId)

        const receivedStar = await userService.addStar(routine.status, userId)



        const stats = await routineService.getStatsByRoutine(updatedTask.routineId, userId)

        return {
            routine,
            stats,
            reward: {
                xpGained: userXp.xpGained,
                leveledUp: userXp.leveledUp,
                newLevel: userXp.newLevel,
                star: receivedStar
            }
        }
    }
    const delet = async (taskId: string, userId: string) => {
        const rawTask = await findById(taskId, userId)
        const now = new Date()
        const taskDomain = Task.cancel(rawTask, now)
        const updatedTask = await taskRepository.
            update(
                taskDomain,
                userId,
                rawTask.id
            )
        const routine = await routineService.findById(updatedTask.routineId, userId)
        const stats = await routineService.getStatsByRoutine(updatedTask.routineId, userId)
        return {
            routine,
            stats
        }

    }

    const findById = async (taskId: string, userId: string) => {
        const task = await taskRepository.findById(taskId, userId)
        if (!task) throw new AppError("Task not found")
        if (task.userId !== userId) throw new AppError("Unauthorized")
        return task
    }

    return {
        start,
        findById,
        pause,
        done,
        delet
    }


}