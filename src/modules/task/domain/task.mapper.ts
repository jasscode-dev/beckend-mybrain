import { TaskDomain, TaskModel } from "./task.types"

export const TaskMapper = {
    toDomain: (task: TaskModel): TaskDomain => {
        return {
            content: task.content,
            routineId: task.routineId,
            category: task.category,
            plannedStart: task.plannedStart,
            plannedEnd: task.plannedEnd,
            durationSec: task.durationSec,
            status: task.status,
            startedAt: task.startedAt,
            finishedAt: task.finishedAt,
            cancelledAt: task.cancelledAt,
            totalSeconds: task.totalSeconds,
            actualDurationSec: task.actualDurationSec,
        }
    },
    toResponse: (task: TaskModel) => {
        return {
            id: task.id,
            userId: task.userId,
            content: task.content,
            routineId: task.routineId,
            category: task.category,
            plannedStart: task.plannedStart,
            plannedEnd: task.plannedEnd,
            durationSec: task.durationSec,
            status: task.status,
            startedAt: task.startedAt,
            finishedAt: task.finishedAt,
            cancelledAt: task.cancelledAt,
            totalSeconds: task.totalSeconds,
            actualDurationSec: task.actualDurationSec,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        }

    }




}
