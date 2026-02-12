import { Request, Response } from "express";
import { IRoutineRepository } from "@modules/routine/repositories";
import { IUserRepository } from "@modules/user/repositories";

export const StatsController = (
    routineRepository: IRoutineRepository,
    userRepository: IUserRepository
) => {
    return {
        getHighlights: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"; // TODO: get from token
            const month = parseInt(req.query.month as string);
            const year = parseInt(req.query.year as string);

            if (isNaN(month) || isNaN(year)) {
                return res.status(400).json({ message: "Month and Year are required" });
            }

            const user = await userRepository.findById(userId);
            const routines = await routineRepository.findByUserAndMonth(userId, year, month);

            const perfectDays = routines.filter(r => r.status === 'DONE').length;
            const incompleteDays = routines.filter(r => r.status === 'INCOMPLETE').length;

            return res.status(200).json({
                perfectDays,
                incompleteDays,
                totalStars: user?.stars || 0,
                weeklyTulips: user?.tulips || 0 // Total as fallback for weekly for now
            });
        }
    };
};
