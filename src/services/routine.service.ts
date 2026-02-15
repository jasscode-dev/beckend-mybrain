
import { Routine } from "src/domain/routine";
import { Task } from "src/domain/task";
import { RoutineMapper } from "src/mappers/routine.mapper";
import { IRoutineRepository } from "src/reposirories/routine.repository";
import { ITaskRepository } from "src/reposirories/task.repository";
import { TaskInput } from "src/types/task.type";
import { normalizeDate } from "src/utils/date";


export const RoutineService = (
    repository: IRoutineRepository,
    taskRepository: ITaskRepository
) => {

    const findById = async (id: string, userId: string) => {
        const routine = await repository.findById(id, userId);
        if (!routine) throw new Error("Routine not found");
        if (routine.userId !== userId) throw new Error("Unauthorized");
        return routine;
    }

    const getStatsByRoutine = async (routineId: string, userId: string) => {
        const routineCheck = await repository.findById(routineId, userId);
        if (!routineCheck) throw new Error("Routine not found");

        const [stats, completedCount] = await Promise.all([
            repository.getRoutineTaskStats(routineId, userId),
            repository.getCompletedTaskCount(routineId, userId)
        ]);

        const totalTasks = stats._count._all;
        const totalSecondsPlanned = stats._sum.durationSec || 0;
        const completedSeconds = stats._sum.actualDurationSec || 0;

        const completionRate = totalTasks > 0
            ? Math.round((completedCount / totalTasks) * 100)
            : 0;

        return {
            totalTasks,
            completedTasks: completedCount,
            completionRate,
            totalSecondsPlanned,
            completedSeconds
        };
    }

    const getOrCreateDailyRoutine = async (userId: string, date: Date) => {
        const existingRoutine = await repository.findByUserAndDay(userId, date);
        if (existingRoutine) return existingRoutine;
        return await repository.create(date, userId);
    }



    return {
        addTask: async (dateStr: string, taskInput: TaskInput, userId: string) => {
            const date = normalizeDate(new Date(dateStr));
            const routine = await getOrCreateDailyRoutine(userId, date);

            if (routine.status !== 'PENDING') {
                throw new Error("Tasks can only be added to a pending routine.");
            }

            await taskRepository.save(Task.create(taskInput, routine.id), userId, routine.id);

            const updatedRoutine = await repository.findByUserAndDayWithTasks(userId, routine.date);
            const stats = await getStatsByRoutine(routine.id, userId);

            return {
                routine: updatedRoutine,
                stats
            }
        },

        findByDay: async (userId: string, dateStr: string) => {
            const date = normalizeDate(new Date(dateStr));
            const routine = await repository.findByUserAndDayWithTasks(userId, date);
            if (!routine) return null;
            if (routine?.userId !== userId) throw new Error("Unauthorized");
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
            const routine = await findById(routineId, userId)
            const updatedDomain = Routine.start(
                RoutineMapper.modelToDomain(routine),
                new Date());
            return await repository.update(routineId, updatedDomain);
        },

        /* finish: async (routineId: string, userId: string) => {
            const routineDomain = await findAndAuthorize(routineId, userId);
            const updatedDomain = Routine.finish(routineDomain, new Date());
            return await repository.update(routineId, updatedDomain);
        },

        cancel: async (routineId: string, userId: string) => {
            const routineDomain = await findAndAuthorize(routineId, userId);
            const updatedDomain = Routine.cancel(routineDomain, new Date());
            return await repository.update(routineId, updatedDomain);
        }, */

        findById,
        getStatsByRoutine,
    }
}
