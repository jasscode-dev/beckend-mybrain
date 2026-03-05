
import { Routine } from "src/domain/routine";
import { Task } from "src/domain/task";
import { AppError } from "src/errors/appError";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { IUserRepository } from "src/reposirories/user.repository";
import { RoutineDomain, RoutineStats } from "src/types/routine.type";
import { TaskDomain, TaskInput } from "src/types/task.type";
import { dateNow, normalizeDate } from "src/utils/date";
import { UserService } from "./user.service";


export const RoutineService = (
    repository: IRoutineRepository,
    taskRepository: ITaskRepository,
    userRepository: IUserRepository
) => {
    const userService = UserService(userRepository);

    const findById = async (id: string, userId: string) => {
        const routine = await repository.findById(id, userId);
        if (!routine) throw new AppError("Routine not found");
        if (routine.userId !== userId) throw new AppError("Unauthorized");
        return routine;
    }

    const getStatsByRoutine = async (routineId: string, userId: string): Promise<RoutineStats> => {
        const routineCheck = await repository.findById(routineId, userId);
        if (!routineCheck) throw new AppError("Routine not found", 404);

        const statsRaw = await repository.getRoutineTaskStats(routineId, userId);

        if (!statsRaw || statsRaw._count._all === 0) {
            return {
                totalTasks: 0,
                completedTasks: 0,
                completionRate: 0,
                totalSecondsPlanned: 0,
                completedSeconds: 0,
            };
        }

        const completedTasks = await repository.getCompletedTaskCount(routineId, userId);
        const totalTasks = statsRaw._count._all;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;


        return {
            totalTasks: totalTasks,
            completedTasks: completedTasks,
            completionRate: completionRate,
            totalSecondsPlanned: statsRaw._sum.durationSec || 0,
            completedSeconds: statsRaw._sum.actualDurationSec || 0,
        };
    }

    const getOrCreateDailyRoutine = async (userId: string, date: Date) => {

        const existingRoutine = await repository.findByUserAndDay(userId, date);
        if (existingRoutine) return existingRoutine;
        return await repository.create(date, userId);
    }



    return {
        create: async (userId: string, taskInput: TaskInput, date: Date) => {

            const timezone = 'America/Sao_Paulo'
            // TODO: handle timezone in a better way, maybe by user preference or by request header
            const day = normalizeDate(date, timezone)
            const routineData = await getOrCreateDailyRoutine(userId, day)

            if (routineData.status === 'COMPLETED') {
                await userService.removeStar(userId)
            }
            const newTask = Task.create(taskInput)
            const now = normalizeDate(new Date(), timezone)
            const routineDomain = Routine.addTask(
                RoutineMapper.modelToDomain(routineData), newTask, now)

            const routineSave = await repository.save(
                routineDomain, newTask, userId
            )
            const stats = await getStatsByRoutine(routineSave.id, userId)

            return {
                routine: routineSave,
                stats
            }




        },

        findByDay: async (userId: string, date: Date) => {

            const routine = await repository.findByUserAndDayWithTasks(userId, date);
            if (!routine) return null;
            if (routine?.userId !== userId) throw new AppError("Unauthorized");
            const stats = await getStatsByRoutine(routine.id, userId);
            return {
                routine,
                stats
            }
        },

        findAllByUser: async (userId: string) => {
            return await repository.findAllByUser(userId);
        },

        start: async (routineId: string, userId: string) => {
            const timezone = 'America/Sao_Paulo'
            const now = normalizeDate(new Date(), timezone)
            const routine = await findById(routineId, userId)
            const updatedDomain = Routine.start(
                RoutineMapper.modelToDomain(routine),
                now
            );
            return await repository.update(routineId, userId, updatedDomain
            );
        },
        completedRoutine: async (routineId: string, userId: string) => {
            const routine = await findById(routineId, userId)
            const dones = await repository.getCompletedTaskCount(routineId, userId)


            const updatedDomain = Routine.finish(
                RoutineMapper.modelToDomain(routine),
                new Date(),
                dones
            );

            return await repository.update(routineId, userId,
                updatedDomain);

        },

        unmark: async (routineId: string, userId: string) => {
            const routineData = await findById(routineId, userId);
            const routineDomain = Routine.unmarkTask(RoutineMapper.modelToDomain(routineData));

            return await repository.update(routineId, userId, routineDomain);
        },

        findById,
        getStatsByRoutine,
        getOrCreateDailyRoutine
    }
}
