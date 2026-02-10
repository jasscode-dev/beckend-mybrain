import { RoutineModel, RoutineStats } from "@modules/routine/types/routine.types"
import { IRoutineRepository } from "@modules/routine/repositories"


export const InMemoryRoutineRepository = (initialRoutine: RoutineModel[]): IRoutineRepository => {
    const routines: RoutineModel[] = [...initialRoutine]
    return {
        async save(date: Date, userId: string): Promise<RoutineModel> {
            const created: RoutineModel = {
                id: crypto.randomUUID(),
                date,
                userId,
                status: 'PENDING',
                startedAt: null,
                finishedAt: null,
                tasks: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            routines.push(created)
            return created
        },

        async findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null> {
            return routines.find(r => r.userId === userId && r.date.getTime() === date.getTime()) ?? null
        },

        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            return routines.filter(r => r.userId === userId)
        },

        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            return routines.find(r => r.id === id && r.userId === userId) ?? null
        },

        async getRoutineStats(routineId: string, userId: string): Promise<RoutineStats> {
            const routine = routines.find(r => r.id === routineId && r.userId === userId)
            if (!routine) throw new Error("Routine not found")

            const tasks = routine.tasks || []
            const totalTasks = tasks.length
            const completedTasks = tasks.filter(t => t.status === 'DONE').length
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            const totalSecondsPlanned = tasks.reduce((sum, t) => sum + t.durationSec, 0)
            const completedSeconds = tasks
                .filter(t => t.status === 'DONE')
                .reduce((sum, t) => sum + t.actualDurationSec, 0)

            return {
                totalTasks,
                completedTasks,
                completionRate,
                totalSecondsPlanned,
                completedSeconds
            }
        },

        async update(id: string, userId: string, data: Partial<Omit<RoutineModel, 'id' | 'userId' | 'createdAt' | 'tasks'>>): Promise<RoutineModel> {
            const index = routines.findIndex(r => r.id === id && r.userId === userId);
            if (index === -1) throw new Error("Routine not found");

            const updated: RoutineModel = {
                ...routines[index],
                ...data,
                updatedAt: new Date()
            }
            routines[index] = updated
            return updated
        }
    }
}
