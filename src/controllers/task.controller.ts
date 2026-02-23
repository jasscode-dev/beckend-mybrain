import { Response } from "express";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { IUserRepository } from "src/reposirories/user.repository";
import { TaskService } from "src/services/task.service";
import { idTaskSchema } from "src/validators/task.schema";
import { AuthRequest } from "src/middlewares/auth.middleware";


export const TaskController = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository,
    userRepository: IUserRepository
) => {
    const taskService = TaskService(taskRepository, routineRepository, userRepository);
    return {
        start: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.start(dataParams.id, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        },
        pause: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.pause(dataParams.id, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        },
        done: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;
            const dataParams = idTaskSchema.parse(req.params)
            const data = await taskService.done(dataParams.id, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats,
                reward: data.reward
            })
        },
        delete: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.delet(dataParams.id, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        }
    };

}