import { TaskController } from "src/controllers/task.controller";
import { RoutineRepository } from "src/reposirories/routine.repository";
import { TaskRepository } from "src/reposirories/task.repository";
import { UserRepository } from "src/reposirories/user.repository";


export const taskController = TaskController(
    TaskRepository(),
    RoutineRepository(),
    UserRepository()

); 