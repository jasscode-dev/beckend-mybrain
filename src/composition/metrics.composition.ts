import { MetricsController } from "@modules/metrics/controllers/metrics.controller";
import { RoutineRepository } from "@modules/routine/repositories";
import { TaskRepository } from "@modules/task/repositories";
import { UserRepository } from "@modules/user/repositories";
import { RoutineService } from "@modules/routine/services/routine.service";

const routineRepository = RoutineRepository();
const taskRepository = TaskRepository();

export const metricsController = MetricsController(
    RoutineService(routineRepository, taskRepository),
    UserRepository()
);
