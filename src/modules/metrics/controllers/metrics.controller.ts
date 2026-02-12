import { Request, Response } from "express";
import { IRoutineRepository } from "@modules/routine/repositories";
import { IUserRepository } from "@modules/user/repositories";

import { RoutineService } from "@modules/routine/services/routine.service";

export const MetricsController = (
    routineService: ReturnType<typeof RoutineService>,
    userRepository: IUserRepository
) => {
    return {
        getHighlights: async (req: Request, res: Response) => {
            const userId = "ckxq9kz3v0000z8m1f3q9p8a1"; // TODO: get from token
            const period = (req.query.period as any) || 'all';

            const [user, highlights] = await Promise.all([
                userRepository.findById(userId),
                routineService.getStatsByPeriod(userId, period)
            ]);

            return res.status(200).json({
                ...highlights,
                totalStars: user?.stars || 0,
                tulips: user?.tulips || 0
            });
        }
    };
};
