import { TaskController } from "src/controllers/task.controller";
import { RoutineRepository } from "src/reposirories/routine.repository";
import { TaskRepository } from "src/reposirories/task.repository";


export const taskController = TaskController(
    TaskRepository(),
    RoutineRepository(),

); 