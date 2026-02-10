import { TaskDomain, TaskModel } from "@modules/task/domain";

export interface ITaskRepository {
    save(task: TaskDomain, userId: string): Promise<TaskModel>;
    update(id: string, task: TaskDomain, userId: string): Promise<TaskModel>;
    findById(id: string, userId: string): Promise<TaskModel | null>;
    delete(id: string, userId: string): Promise<void>;
    findAll(userId: string): Promise<TaskModel[]>;
    findAllByRoutineId(routineId: string, userId: string): Promise<TaskModel[]>;


}