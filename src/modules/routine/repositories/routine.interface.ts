import { RoutineHighlights, RoutineModel, RoutineStats, RoutineStatus, RoutineTaskStatsAggregate } from "../types/routine.types";



export interface IRoutineRepository {
    save(date: Date, userId: string): Promise<RoutineModel>;
    findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null>;
    findByUserAndDayWithTasks(userId: string, date: Date): Promise<RoutineModel | null>;
    findByUserAndMonth(userId: string, year: number, month: number): Promise<RoutineModel[]>;
    findAllByUser(userId: string): Promise<RoutineModel[]>;
    findByUserAndRange(userId: string, start: Date, end: Date): Promise<RoutineModel[]>;
    getHighlights(userId: string, start: Date, end: Date): Promise<RoutineHighlights>;
    findById(id: string, userId: string): Promise<RoutineModel | null>;
    getRoutineTaskStats(routineId: string, userId: string): Promise<RoutineTaskStatsAggregate>;
    getCompletedTaskCount(routineId: string, userId: string): Promise<number>;
    update(id: string, userId: string, data: Partial<Omit<RoutineModel, 'id' | 'userId' | 'createdAt' | 'tasks'>>): Promise<RoutineModel>;
}
