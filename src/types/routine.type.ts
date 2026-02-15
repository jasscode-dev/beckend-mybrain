import { TaskDomain, TaskModel } from "./task.type"


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

export type RoutineDomain = {
    date: Date
    status: RoutineStatus
    tasks: TaskDomain[]
    startedAt: Date | null
    finishedAt: Date | null
    cancelledAt: Date | null
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




export type RoutineStatus = "PENDING" | "INPROGRESS" | "DONE" | "INCOMPLETE"
