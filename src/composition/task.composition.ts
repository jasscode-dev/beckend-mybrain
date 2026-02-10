import { TaskController } from "@modules/task/controllers/task.controller";
import { TaskRepository } from "@modules/task/repositories";
import { RoutineRepository } from "@modules/routine/repositories";
import { UserRepository } from "@modules/user/repositories";

export const taskController = TaskController(
    TaskRepository(),
    RoutineRepository(),
    UserRepository()
);