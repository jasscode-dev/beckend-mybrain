import { RoutineDomain } from "./routine.types"

export const createRoutine = (userId: string, date: Date): RoutineDomain => {
    return Object.freeze({
        userId,
        date,
        tasks: [],
        status: 'PENDING',
        totalTasks: 0,
        completedTasks: 0
    })
}