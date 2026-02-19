import { Request, Response } from "express";
import { normalize } from "node:path";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { RoutineService } from "src/services/routine.service";
import { normalizeDate } from "src/utils/date";
import { RoutineParams } from "src/validators/routine.schema";



export const RoutineController = (
    routineRepository: IRoutineRepository,
    taskRepository: ITaskRepository
) => {
    const routineService = RoutineService(routineRepository, taskRepository);
    return {

        create: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            // TODO: get from token

            const { content, plannedStart, plannedEnd, category } = req.body
            const { date } = req.params as unknown as RoutineParams;


            const data = await routineService.create(userId,
                { content, plannedStart, plannedEnd, category },
                date
            )
            if (!data.routine) return res.status(200).json([])

            return res.status(201).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })

        },

        getByDate: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            // TODO: get from token
            const { date } = req.params as unknown as RoutineParams;
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
