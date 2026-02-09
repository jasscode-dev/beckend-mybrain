import { RoutineModel, RoutineDomain } from "@modules/routine/domain"
import { IRoutineRepository } from "@modules/routine/repositories"


export const InMemoryRoutineRepository = (initialRoutine: RoutineModel[]): IRoutineRepository => {
    const routines: RoutineModel[] = [...initialRoutine]
    return {
        async save(routine: RoutineDomain): Promise<RoutineModel> {
            const created: RoutineModel = {
                id: crypto.randomUUID(),
                date: routine.date,
                userId: routine.userId,
                routineStatus: routine.status,
                totalTasks: 0, // Calculated from tasks relation
                completedTasks: 0, // Calculated from tasks relation
                completionRate: 0,
                starEarned: false,
                xpEarned: 0,
                tasks: [],
                totalHoursPlanned: 0, // Calculated from tasks relation
                completedHoursPlanned: 0, // Calculated from tasks relation
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
        async findById(id: string): Promise<RoutineModel | null> {
            return routines.find(r => r.id === id) ?? null
        }
        ,
        async update(routine: RoutineDomain, userId: string, id: string): Promise<RoutineModel> {
            const index = routines.findIndex(r => r.id === id && r.userId === userId);
            if (index === -1) throw new Error("Routine not found");
            const updated: RoutineModel = {
                ...routines[index],
                date: routine.date,
                userId: routine.userId,
                routineStatus: routine.status,
                updatedAt: new Date()
            }
            routines[index] = updated
            return updated
        }




    }
}