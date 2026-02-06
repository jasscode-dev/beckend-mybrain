import { TaskDomain, TaskResponse } from "@modules/task/domain"

export type RoutineStatus = 'PENDING' | 'INPROGRESS' | 'DONE' | 'PARTIAL'
export interface RoutineDomain {
    userId: string,
    date: Date
    tasks: TaskDomain[]
    status: RoutineStatus
    totalTasks: number
    completedTasks: number
  
}

export interface RoutineResponse {
    id: string
    date: Date
    userId: string
    routineStatus: RoutineStatus
    totalTasks: number
    completedTasks: number
    completionRate: number
    starEarned: boolean
    xpEarned: number
    tasks?: TaskResponse[]
}

