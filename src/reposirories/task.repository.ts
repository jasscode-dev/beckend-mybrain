;



import { prisma } from "src/lib/prisma";
import { TaskDomain, TaskModel } from "src/types/task.type";




export interface ITaskRepository {
    save(task: TaskDomain, userId: string, routineId: string): Promise<TaskModel>;
    findById(taskId: string, userId: string): Promise<TaskModel | null>;
    update(task: TaskDomain, userId: string, id: string): Promise<TaskModel>;
}

export const TaskRepository = (): ITaskRepository => {
    return {
        async save(task: TaskDomain, userId: string, routineId: string): Promise<TaskModel> {
            return await prisma.task.create({
                data: {
                    ...task,
                    userId,
                    routineId
                },

            });
        },
        async findById(taskId: string, userId: string): Promise<TaskModel | null> {
            return await prisma.task.findUnique({
                where: {
                    id: taskId,
                    userId
                }
            })
        },
        async update(task: TaskDomain, userId: string, id: string): Promise<TaskModel> {
            return await prisma.task.update({
                where: {userId,id},
                data: {
                ...task,
                updatedAt: new Date()
            },
            include: {
                routine: true
            }

            });
},


    }
};
