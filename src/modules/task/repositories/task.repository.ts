import { prisma } from "@/lib/prisma";
import { TaskDomain, TaskModel } from "@modules/task/domain";
import { ITaskRepository } from "./task.interface";

export const TaskRepository = (): ITaskRepository => {
    return {
        async save(task: TaskDomain, userId: string): Promise<TaskModel> {
            const created = await prisma.task.create({
                data: {
                    content: task.content,
                    category: task.category,
                    plannedStart: task.plannedStart,
                    plannedEnd: task.plannedEnd,
                    durationSec: task.durationSec,
                    actualDurationSec: 0,
                    status: 'PENDING',
                    routineId: task.routineId,
                }
            });

            return {
                ...created,
                userId,
                totalSeconds: 0,
            } as TaskModel;
        },

        async update(id: string, task: TaskDomain, userId: string): Promise<TaskModel> {
            const updated = await prisma.task.update({
                where: { id },
                data: {
                    content: task.content,
                    status: task.status,
                    category: task.category,
                    plannedStart: task.plannedStart,
                    plannedEnd: task.plannedEnd,
                    durationSec: task.durationSec,
                    startedAt: task.startedAt,
                    finishedAt: task.finishedAt,
                    cancelledAt: task.cancelledAt,
                    actualDurationSec: task.actualDurationSec,
                }
            });

            return {
                ...updated,
                userId,
                totalSeconds: task.actualDurationSec,
            } as TaskModel;
        },

        async findById(id: string, userId: string): Promise<TaskModel | null> {
            const task = await prisma.task.findFirst({
                where: {
                    id,
                    routine: {
                        userId
                    }
                }
            });

            if (!task) return null;

            return {
                ...task,
                userId,
                totalSeconds: task.actualDurationSec,
            } as TaskModel;
        },

        async findAll(userId: string): Promise<TaskModel[]> {
            const tasks = await prisma.task.findMany({
                where: {
                    routine: {
                        userId
                    }
                },
                orderBy: {
                    plannedStart: 'asc'
                }
            });

            return tasks.map(task => ({
                ...task,
                userId,
                totalSeconds: task.actualDurationSec,
            })) as TaskModel[];
        },

        async delete(id: string, userId: string): Promise<void> {
            await prisma.task.updateMany({
                where: {
                    id,
                    routine: {
                        userId
                    }
                },
                data: {
                    status: 'CANCELLED',
                    cancelledAt: new Date()
                }
            });
        },

        async findAllByRoutineId(routineId: string, userId: string): Promise<TaskModel[]> {
            const tasks = await prisma.task.findMany({
                where: {
                    routineId,
                    routine: {
                        userId
                    }
                },
                orderBy: {
                    plannedStart: 'asc'
                }
            });

            return tasks.map(task => ({
                ...task,
                userId,
                totalSeconds: task.actualDurationSec,
            })) as TaskModel[];
        }
    };
};
