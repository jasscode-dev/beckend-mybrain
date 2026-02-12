

import type { Request, Response } from "express";
import { ITaskRepository } from "src/modules/task/repositories";
import { TaskService } from "src/modules/task/services/task.service";
import { IRoutineRepository } from "src/modules/routine/repositories";
import { IUserRepository } from "src/modules/user/repositories";
import { TaskMapper } from "../domain";
import { getLengthableOrigin } from "zod/v4/core/util.cjs";



export const TaskController = (TaskRepository: ITaskRepository,
    RoutineRepository: IRoutineRepository, UserRepository: IUserRepository) => {
    const taskService = TaskService(TaskRepository, RoutineRepository, UserRepository)
    return {
        create: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { content, plannedStart, plannedEnd, category } = req.body
            const newTask = await taskService.create({ content, plannedStart, plannedEnd, category }, userId)

            return res.status(201).json({
                task: TaskMapper.toResponse(newTask.task),
                routineStats: newTask.stats
            })
        },
        start: async (req: Request<{ id: string }>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { id } = req.params

            const data = await taskService.start(id, userId)

            return res.status(200).json({
                task: TaskMapper.toResponse(data.task),
                routineStats: data.stats
            })
        },
        pause: async (req: Request<{ id: string }>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { id } = req.params
            const task = await taskService.pause(id, userId)
            return res.status(200).json(task)
        },

        done: async (req: Request<{ id: string }>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { id } = req.params
            const data = await taskService.done(id, userId)
            return res.status(200).json({
                task: TaskMapper.toResponse(data.task),
                routineStats: data.stats
            })
        },

    }
}

