import { Response, Request } from "express";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { IUserRepository } from "src/reposirories/user.repository";
import { TaskService } from "src/services/task.service";
import { idTaskSchema } from "src/validators/task.schema";



export const TaskController = (
    taskRepository: ITaskRepository,
    routineRepository: IRoutineRepository,
    userRepository: IUserRepository
) => {
    const taskService = TaskService(taskRepository, routineRepository, userRepository);
    return {
        start: async (req: Request, res: Response) => {

            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized", data: null });
            }
            const userId = user.id;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.start(dataParams.id, userId)

            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        },
        pause: async (req: Request, res: Response) => {

            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized", data: null });
            }
            const userId = user.id;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.pause(dataParams.id, userId)

            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        },
        done: async (req: Request, res: Response) => {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized", data: null });
            }
            const userId = user.id;
            const dataParams = idTaskSchema.parse(req.params)
            const data = await taskService.done(dataParams.id, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats,
                reward: data.reward
            })
        },
        delete: async (req: Request, res: Response) => {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized", data: null });
            }
            const userId = user.id;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.delet(dataParams.id, userId)
            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        },
        unmark: async (req: Request, res: Response) => {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "Unauthorized", data: null });
            }
            const userId = user.id;
            const dataParams = idTaskSchema.parse(req.params)

            const data = await taskService.unmark(dataParams.id, userId)

            return res.status(200).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })
        }
    };

}