import { RoutineController } from "@modules/routine/controllers/routine.controller";
import { RoutineRepository } from "@modules/routine/repositories";
import { TaskRepository } from "@modules/task/repositories";

export const routineController = RoutineController(
    RoutineRepository(),
    TaskRepository()
);
