import { Response } from "express";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { IUserRepository} from "src/reposirories/user.repository";
import { RoutineService } from "src/services/routine.service";
import { routineSchema } from "src/validators/routine.schema";
import { AuthRequest } from "src/middlewares/auth.middleware";




export const RoutineController = (
    routineRepository: IRoutineRepository,
    taskRepository: ITaskRepository,
    userRepository: IUserRepository
) => {
    const routineService = RoutineService(routineRepository, taskRepository,userRepository);
    return {

        create: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;

            const { content, plannedStart, plannedEnd, category } = req.body

            const dataParams = routineSchema.parse(req.params)

            const data = await routineService.create(userId,
                { content, plannedStart, plannedEnd, category },
                dataParams.date
            )

            return res.status(201).json({
                routine: RoutineMapper.toResponse(data.routine),
                stats: data.stats
            })

        },

        getByDate: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;
            const dataParams = routineSchema.parse(req.params)
            const routine = await routineService.findByDay(userId, dataParams.date)

            if (!routine) return res.status(404).json({ message: 'Routine not found for this date' })

            return res.status(200).json({
                routine: RoutineMapper.toResponse(routine.routine),
                stats: routine.stats
            })

        },
        getAllRoutines: async (req: AuthRequest, res: Response) => {
            const userId = req.userId!;
            const routines = await routineService.findAllByUser(userId)
            return res.status(200).json(routines.map(r => RoutineMapper.toResponse(r)))
        }



    };
};
