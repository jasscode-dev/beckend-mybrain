
import { TaskModel } from "@modules/task/domain"

export type RoutineModel = {
    id: string
    userId: string
    date: Date
    status: RoutineStatus
    startedAt: Date | null
    finishedAt: Date | null
    cancelledAt: Date | null
    tasks?: TaskModel[]
    createdAt: Date
    updatedAt: Date
}
export type RoutineStats = {
    totalTasks: number
    completedTasks: number
    completionRate: number
    totalSecondsPlanned: number
    completedSeconds: number
}
export type RoutineSummary = {
    routine: RoutineModel
    stats: RoutineStats
}
export type UpdateRoutineResult = {
    changedTo: 'DONE' | null
}

export type RoutineHighlights = {

    perfectDays: number;
    incompleteDays: number;
    dailyPercentages: { day: number; percentage: number }[];
}
export type RoutineTaskStatsAggregate = {
    _count: {
        _all: number;
    };
    _sum: {
        durationSec: number | null;
        actualDurationSec: number | null;
    };
}


export type RoutineStatus = "PENDING" | "INPROGRESS" | "DONE" | "INCOMPLETE"
