import { RoutineModel, RoutineStats, RoutineStatus } from "../types/routine.types";



export interface IRoutineRepository {
    save(date: Date, userId: string): Promise<RoutineModel>;
    findByUserAndDay(userId: string, date: Date): Promise<RoutineModel | null>;
    findAllByUser(userId: string): Promise<RoutineModel[]>;
    findById(id: string, userId: string): Promise<RoutineModel | null>;
    getRoutineStats(routineId: string, userId: string): Promise<RoutineStats>;
    update(id: string, userId: string): Promise<RoutineModel>
    makeDone(id: string, userId: string): Promise<boolean>
    startProcessing(id: string, userId: string): Promise<boolean>
    makeFailed(id: string, userId: string): Promise<boolean>

}