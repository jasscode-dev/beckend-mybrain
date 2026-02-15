
import { Task } from "src/domain/task";
import { ITaskRepository } from "src/reposirories/task.repository";
import { RoutineService } from "./routine.service";
import { IRoutineRepository } from "src/reposirories/routine.repository";

export const TaskService = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository
) => {
    const routineService = RoutineService(routineRepository, taskRepository)

    const start = async (taskId: string, userId: string) => {
        const rawTask = await findById(taskId, userId)
        const date = new Date()
        const updatedTask = await taskRepository.
            update(
                Task.start(rawTask, date),
                userId,
                rawTask.id

            )

        routineService.start(updatedTask.routineId, userId)

        const routine = await routineService.findById(updatedTask.routineId, userId)


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
        const routine = routineService.findById(updatedTask.routineId, userId)
        const stats = await routineService.getStatsByRoutine(updatedTask.routineId, userId)
        return {
            routine,
            stats
        }
    }

    const findById = async (taskId: string, userId: string) => {
        const task = await taskRepository.findById(taskId, userId)
        if (!task) throw new Error("Task not found")
        if (task.userId !== userId) throw new Error("Unauthorized")
        return task
    }
    return {
        start,
        findById
    }


}