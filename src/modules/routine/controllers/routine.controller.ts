import { Request, Response } from "express";
import { IRoutineRepository } from "src/modules/routine/repositories";
import { ITaskRepository } from "src/modules/task/repositories";
import { TaskMapper } from "src/modules/task/domain/task.mapper";
import { normalize } from "node:path";
import { normalizeDate } from "@modules/task/domain";
import { RoutineService } from "../services/routine.service";

export const RoutineController = (
    routineRepository: IRoutineRepository,
    taskRepository: ITaskRepository
) => {
    const routineService = RoutineService(routineRepository, taskRepository);
    return {
        getToday: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1";
            // TODO: get from token


            const routine = await routineService.getRoutineToday(userId);
            console.log(routine)
            /*  if (!routine) {
                 return res.status(200).json({ routine: null, tasks: [], stats: null });
             } */




            return res.status(200).json({
                routine: routine?.routine,
                tasks: routine?.routine.tasks?.map(task => TaskMapper.toResponse(task)),
                stats: routine?.stats

            });
        },
        getStats: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"; // TODO: get from token
            const period = req.query.period as 'day' | 'week' | 'month' | 'all';
            //TODO: validar periodo


            //TODO: pegar stats semana

            return res.status(200).json("stats");
        },

        getCalendar: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"; // TODO: get from token
            const month = parseInt(req.query.month as string);
            const year = parseInt(req.query.year as string);

            if (isNaN(month) || isNaN(year)) {
                return res.status(400).json({ message: "Month and Year are required" });
            }

            const routines = await routineRepository.findByUserAndMonth(userId, year, month);

            const calendar = routines.map(r => ({
                date: r.date,
                status: r.status
            }));

            return res.status(200).json(calendar);
        }
    };
};
