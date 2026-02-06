import { TaskDomain } from "@modules/task/domain"

export type RoutineStatus = 'PENDING' | 'INPROGRESS' | 'DONE' | 'PARTIAL'
export type RoutineDomain = {
    userId: string,
    date: Date
    tasks: TaskDomain[]
    status: RoutineStatus
    totalTasks: number
    completedTasks: number
}
