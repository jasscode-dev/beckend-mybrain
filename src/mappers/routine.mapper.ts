import { Prisma } from "src/generated/prisma"
import { TaskMapper } from "./task.mapper"
import { RoutineDomain, RoutineModel } from "src/types/routine.type"


export const RoutineMapper = {


    toResponse: (routine: RoutineModel) => {
        return {
            id: routine.id,
            date: routine.date,
            status: routine.status,
            startedAt: routine.startedAt,
            finishedAt: routine.finishedAt,
            cancelledAt: routine.cancelledAt,
            tasks: routine.tasks?.map(task => TaskMapper.toResponse(task))

        }
    },
    modelToDomain(routine: RoutineModel): RoutineDomain {
        return {
            date: routine.date,
            status: routine.status,
            tasks: routine.tasks?.map(TaskMapper.modelToDomain) || [],
            startedAt: routine.startedAt,
            finishedAt: routine.finishedAt,
            cancelledAt: routine.cancelledAt,
        }
    },

    domainToPersistence(routine: Partial<RoutineDomain>): Prisma.RoutineUpdateInput {
        return {
            status: routine.status,
            startedAt: routine.startedAt,
            finishedAt: routine.finishedAt,
            cancelledAt: routine.cancelledAt,
        };
    }


}