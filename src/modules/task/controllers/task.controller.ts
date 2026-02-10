

import type { Request, Response } from "express";
import { ITaskRepository } from "@modules/task/repositories";
import { TaskService } from "@modules/task/services/task.service";
import { IRoutineRepository } from "@/modules/routine/repositories";
import { IUserRepository } from "@/modules/user/repositories";



export const TaskController = (TaskRepository: ITaskRepository,
    RoutineRepository: IRoutineRepository, UserRepository: IUserRepository) => {
    const taskService = TaskService(TaskRepository, RoutineRepository, UserRepository)
    return {
        create: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { content, plannedStart, plannedEnd, category } = req.body
            const newTask = await taskService.create({ content, plannedStart, plannedEnd, category }, userId)
            return res.status(201).json(newTask)
        },
        start: async (req: Request<{ id: string }>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { id } = req.params
            const task = await taskService.start(id, userId)
            return res.status(200).json(task)
        },
        findAll: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const tasks = await taskService.findAll(userId)
            return res.status(200).json(tasks)
        },
        findById: async (req: Request<{ id: string }>, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"
            //TODO: get userId from token
            const { id } = req.params
            const task = await taskService.findById(id, userId)
            return res.status(200).json(task)
        }
    }
}

