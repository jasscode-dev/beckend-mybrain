import { RoutineController } from "src/controllers/routine.controller";
import { RoutineRepository } from "src/reposirories/routine.repository";
import { TaskRepository } from "src/reposirories/task.repository";


export const routineController = RoutineController(
    RoutineRepository(),
    TaskRepository()
);
