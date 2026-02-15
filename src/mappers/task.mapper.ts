import { TaskDomain, TaskModel } from "src/types/task.type";

export const TaskMapper = {
    toResponse(task: TaskModel) {
        return {
            id: task.id,
            content: task.content,
            plannedStart: task.plannedStart,
            plannedEnd: task.plannedEnd,
            status: task.status,
            category: task.category,
            durationSec: task.durationSec,

        }
    },
    modelToDomain(task: TaskModel): TaskDomain {
        return {
            content: task.content,
            plannedStart: task.plannedStart,
            plannedEnd: task.plannedEnd,
            status: task.status,
            category: task.category,
            durationSec: task.durationSec,
            routineId: task.routineId,
            startedAt: task.startedAt,
            finishedAt: task.finishedAt,
            cancelledAt: task.cancelledAt,
            actualDurationSec: task.actualDurationSec,
        }
    }
}