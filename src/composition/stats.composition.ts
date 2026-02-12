import { StatsController } from "@modules/stats/stats.controller";
import { RoutineRepository } from "@modules/routine/repositories";
import { UserRepository } from "@modules/user/repositories";

export const statsController = StatsController(
    RoutineRepository(),
    UserRepository()
);
