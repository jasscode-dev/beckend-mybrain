import { RoutineResponse,RoutineDomain } from "@modules/routine/domain"
import { IRoutineRepository } from "@modules/routine/repositories"


export const InMemoryRoutineRepository = (initialRoutine: RoutineResponse[]): IRoutineRepository => {
    const routines: RoutineResponse[] = [...initialRoutine]
    return {
        async save(routine: RoutineDomain): Promise<RoutineResponse> {
            const created: RoutineResponse = {
                id: crypto.randomUUID(),
                date: routine.date,
                userId: routine.userId,
                routineStatus: routine.status,
                totalTasks: routine.totalTasks,
                completedTasks: routine.completedTasks,
                completionRate: 0,
                starEarned: false,
                xpEarned: 0,
                tasks: []
            }
            routines.push(created)
            return created
        },

        async findByUserAndDay(userId: string, date: Date): Promise<RoutineResponse | null> {
            return routines.find(r => r.userId === userId && r.date.getTime() === date.getTime()) ?? null
        },
        async findAllByUser(userId: string): Promise<RoutineResponse[]> {
            return routines.filter(r => r.userId === userId)
        },
        async findById(id: string): Promise<RoutineResponse | null> {
            return routines.find(r => r.id === id) ?? null
        }


    }
}