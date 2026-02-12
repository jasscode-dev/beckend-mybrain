import { RoutineHighlights, RoutineModel, RoutineStats } from "@modules/routine/types/routine.types"
import { IRoutineRepository } from "@modules/routine/repositories"
import { ITaskRepository } from "@modules/task/repositories"


export const InMemoryRoutineRepository = (initialRoutine: RoutineModel[], taskRepository?: ITaskRepository): IRoutineRepository => {
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
                cancelledAt: null,
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

        async findByUserAndDayWithTasks(userId: string, date: Date): Promise<RoutineModel | null> {
            const routine = routines.find(r => r.userId === userId && r.date.getTime() === date.getTime());
            if (!routine) return null;

            // Simula o include de tasks
            const tasks = taskRepository
                ? await taskRepository.findAllByRoutineId(routine.id, userId)
                : (routine.tasks || []);

            return { ...routine, tasks };
        },

        async findByUserAndMonth(userId: string, year: number, month: number): Promise<RoutineModel[]> {
            return routines.filter(r => {
                const d = new Date(r.date);
                return r.userId === userId && d.getFullYear() === year && (d.getMonth() + 1) === month;
            }).sort((a, b) => a.date.getTime() - b.date.getTime());
        },

        async findAllByUser(userId: string): Promise<RoutineModel[]> {
            return routines.filter(r => r.userId === userId)
        },

        async findByUserAndRange(userId: string, start: Date, end: Date): Promise<RoutineModel[]> {
            return routines.filter(r =>
                r.userId === userId &&
                r.date >= start &&
                r.date <= end
            ).sort((a, b) => a.date.getTime() - b.date.getTime());
        },

        async getHighlights(userId: string, start: Date, end: Date): Promise<RoutineHighlights> {
            const periodRoutines = routines.filter(r =>
                r.userId === userId &&
                r.date >= start &&
                r.date <= end
            );

            const perfectDays = periodRoutines.filter(r => r.status === 'DONE').length;
            const incompleteDays = periodRoutines.filter(r => r.status === 'INCOMPLETE').length;

            const dayStats: Record<number, { total: number; done: number }> = {};
            periodRoutines.forEach(r => {
                const day = r.date.getDay();
                if (!dayStats[day]) dayStats[day] = { total: 0, done: 0 };
                dayStats[day].total++;
                if (r.status === 'DONE') dayStats[day].done++;
            });

            const dailyPercentages = Object.entries(dayStats).map(([day, stats]) => ({
                day: parseInt(day),
                percentage: stats.total > 0 ? (stats.done / stats.total) * 100 : 0
            }));

            return {
                perfectDays,
                incompleteDays,
                dailyPercentages
            };
        },

        async findById(id: string, userId: string): Promise<RoutineModel | null> {
            return routines.find(r => r.id === id && r.userId === userId) ?? null
        },

        async getRoutineStats(routineId: string, userId: string): Promise<RoutineStats> {
            const routine = routines.find(r => r.id === routineId && r.userId === userId)
            if (!routine) throw new Error("Routine not found")

            // Usa o taskRepository injetado para buscar tasks reais
            const tasks = taskRepository
                ? await taskRepository.findAllByRoutineId(routineId, userId)
                : (routine.tasks || [])

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
