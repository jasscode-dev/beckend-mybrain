import { prisma } from "@/lib/prisma";
import { TaskDomain, TaskModel } from "@modules/task/domain";
import { ITaskRepository } from "./task.interface";

export const TaskRepository = (): ITaskRepository => {
    return {
        async save(task: TaskDomain): Promise<TaskModel> {
            return await prisma.task.create({
                data: {
                    ...task
                }
            });
        },

        async update(id: string, task: TaskDomain, userId: string): Promise<TaskModel> {
            return await prisma.task.update({
                where: { id, routine: { userId } },
                data: {
                    ...task,
                    updatedAt: new Date()
                }
            });
        },

        async findById(id: string, userId: string): Promise<TaskModel | null> {
            return await prisma.task.findFirst({
                where: { id, routine: { userId } }
            });


        },

        async findAll(userId: string): Promise<TaskModel[]> {
            return await prisma.task.findMany({
                where: { routine: { userId } },
                orderBy: {
                    plannedStart: 'asc'
                }
            });
        },

        async delete(id: string, userId: string): Promise<void> {
            await prisma.task.updateMany({
                where: { id, routine: { userId } },
                data: { status: 'CANCELLED', cancelledAt: new Date() }
            });
        },

        async findAllByRoutineId(routineId: string, userId: string): Promise<TaskModel[]> {
            return await prisma.task.findMany({
                where: { routineId, routine: { userId } },
                orderBy: { plannedStart: 'asc' }
            });

        },



    };
};
