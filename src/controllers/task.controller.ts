import { Request, Response } from "express";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { IUserRepository, UserRepository } from "src/reposirories/user.repository";
import { TaskService } from "src/services/task.service";
import { IdParam } from "src/types/param";

export const TaskController = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository,
    userRepository:IUserRepository
) => {
    const taskService = TaskService(taskRepository, routineRepository,userRepository);
    return {
        start: async (req: Request<IdParam>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            const taskId = req.params.id

            const data = await taskService.start(taskId, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        },
        pause: async (req: Request<IdParam>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            const taskId = req.params.id
            const data = await taskService.pause(taskId, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })


        },
        done: async (req: Request<IdParam>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            const taskId = req.params.id
            const data = await taskService.done(taskId, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        }
    }
}