import { Request, Response } from "express";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { RoutineService } from "src/services/routine.service";



export const RoutineController = (
    routineRepository: IRoutineRepository,
    taskRepository: ITaskRepository
) => {
    const routineService = RoutineService(routineRepository, taskRepository);
    return {

        addTask: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            // TODO: get from token

            const { content, plannedStart, plannedEnd, category } = req.body
            const date = req.params.date as string
            const data = await routineService.addTask(date, { content, plannedStart, plannedEnd, category }, userId)
            if (!data.routine) return res.status(200).json([])
            console.log(data)
            return res.status(201).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })

        },
        getByDate: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            // TODO: get from token
            const date = req.params.date as string
            const routine = await routineService.findByDay(userId, date)

            if (!routine) return res.status(200).json([])

            return res.status(200).json({
                routine: RoutineMapper.toResponse(routine.routine),
                stats: routine.stats
            })

        },
        getAllRoutines: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            // TODO: get from token
            const routines = await routineService.findAllByUser(userId)
            return res.status(200).json(routines.map(r => RoutineMapper.toResponse(r)))
        }   

        
    };
};
