;
import { TaskDomain, TaskModel } from "@modules/task/domain";
import { ITaskRepository } from "./task.interface";
import { prisma } from "src/lib/prisma";

export const TaskRepository = (): ITaskRepository => {
    return {
        async save(task: TaskDomain, userId: string): Promise<TaskModel> {
            return await prisma.task.create({
                data: {
                    ...task,
                    userId
                }
            });
        },

        async update(id: string, task: TaskDomain, userId: string): Promise<TaskModel> {
            return await prisma.task.update({
                where: { id, userId },
                data: {
                    ...task,
                    updatedAt: new Date()
                }
            });
        },

        async findById(id: string, userId: string): Promise<TaskModel | null> {
            return await prisma.task.findFirst({
                where: { id, userId }
            });
        },

        async findAll(userId: string): Promise<TaskModel[]> {
            return await prisma.task.findMany({
                where: { userId },
                orderBy: {
                    plannedStart: 'asc'
                }
            });
        },

        async delete(id: string, userId: string): Promise<void> {
            await prisma.task.updateMany({
                where: { id, userId },
                data: { status: 'CANCELLED', cancelledAt: new Date() }
            });
        },

        async findAllByRoutineId(routineId: string, userId: string): Promise<TaskModel[]> {
            return await prisma.task.findMany({
                where: { routineId, userId },
                orderBy: { plannedStart: 'asc' }
            });
        },



    };
};
