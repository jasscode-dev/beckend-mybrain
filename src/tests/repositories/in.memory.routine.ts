import { IRoutineRepository } from "src/reposirories/routine.repository"
import { RoutineModel, RoutineDomain, RoutineStats } from "src/types/routine.type"
import { TaskDomain, TaskModel } from "src/types/task.type"

export const InMemoryRoutineRepository = (initialRoutine: RoutineModel[] = []): IRoutineRepository => {
    const routines: RoutineModel[] = JSON.parse(JSON.stringify(initialRoutine)) // Deep copy to avoid side effects

    return {
        async create(date: Date, userId: string): Promise<RoutineModel> {
            const newRoutine: RoutineModel = {
                id: crypto.randomUUID(),
                date,
                userId,
                status: 'PENDING',
                startedAt: null,
                finishedAt: null,
                cancelledAt: null,
                tasks: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
            routines.push(newRoutine)
            return newRoutine
        },

        async findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null> {
            const routine = routines.find(r =>
                r.userId === userId &&
                r.date.getTime() === date.getTime()
            )
            return routine || null
        },

        async findByUserAndDayWithTasks(userId: string, date: Date): Promise<RoutineModel | null> {
            // In-memory implementation is the same as findByUserAndDay
            const routine = routines.find(r =>
                r.userId === userId &&
                r.date.getTime() === date.getTime()
            );
            return routine ? { ...routine, tasks: routine.tasks || [] } : null
        },

        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            const routine = routines.find(r => r.id === id && r.userId === userId)
            return routine || null
        },

        async getCompletedTaskCount(routineId: string, userId: string): Promise<number> {
            const routine = routines.find(r => r.id === routineId && r.userId === userId)
            if (!routine || !routine.tasks) return 0
            return routine.tasks.filter(task => task.status === 'DONE').length
        },

        async getRoutineTaskStats(routineId: string, userId: string): Promise<RoutineStats | null> {
            const routine = routines.find(r => r.id === routineId && r.userId === userId)
            if (!routine || !routine.tasks) return null

            const totalTasks = routine.tasks.length
            const completedTasks = routine.tasks.filter(t => t.status === 'DONE').length
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
            const totalSecondsPlanned = routine.tasks.reduce((acc, task) => acc + task.durationSec, 0)
            const completedSeconds = routine.tasks
                .filter(t => t.status === 'DONE')
                .reduce((acc, task) => acc + task.actualDurationSec, 0)

            return {
                totalTasks,
                completedTasks,
                completionRate,
                totalSecondsPlanned,
                completedSeconds,
            }
        },

        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            return routines.filter(r => r.userId === userId)
        },

        async save(routineDomain: RoutineDomain, newTask: TaskDomain, userId: string): Promise<RoutineModel> {
            // This method seems to intend to add a task to a routine.
            // A better name would be `addTaskToRoutine`.
            // The `routineDomain` doesn't have an ID, so we must find it by date.
            const routineIndex = routines.findIndex(r =>
                r.userId === userId &&
                new Date(r.date).toDateString() === new Date(routineDomain.date).toDateString()
            );

            if (routineIndex === -1) {
                throw new Error("Routine not found for the given user and date.");
            }

            const routine = routines[routineIndex];
            
            const taskToAdd: TaskModel = {
                id: crypto.randomUUID(),
                userId,
                routineId: routine.id,
                ...newTask,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            routine.tasks = routine.tasks ? [...routine.tasks, taskToAdd] : [taskToAdd];
            routine.updatedAt = new Date();
            
            routines[routineIndex] = routine;
            
            return routine;
        },

        async update(id: string, userId: string, routineUpdate: Partial<RoutineDomain>): Promise<RoutineModel> {
            const routineIndex = routines.findIndex(r => r.id === id && r.userId === userId)
            if (routineIndex === -1) {
                throw new Error("Routine not found to update.")
            }

            const { tasks, ...routinePropertiesToUpdate } = routineUpdate;

            const updatedRoutine = { 
                ...routines[routineIndex], 
                ...routinePropertiesToUpdate, 
                updatedAt: new Date() 
            }
            
            routines[routineIndex] = updatedRoutine

            return updatedRoutine
        }
    }
}
