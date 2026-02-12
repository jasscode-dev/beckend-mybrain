import { TaskDomain, TaskModel } from "@modules/task/domain";
import { ITaskRepository } from "@modules/task/repositories";



export const InMemoryTaskRepository = (initialTasks: TaskModel[] = []): ITaskRepository => {
    const tasks: TaskModel[] = [...initialTasks]

    return {
        async update(id: string, task: TaskDomain, userId: string) {
            const index = tasks.findIndex(t => t.id === id && t.userId === userId);
            if (index === -1) throw new Error("Task not found or unauthorized");
            const updatedTask = {
                ...tasks[index],
                ...task,
                updatedAt: new Date()
            } as TaskModel;
            tasks[index] = updatedTask;
            return updatedTask;
        },

        async findById(id: string, userId: string) {
            return tasks.find(t => t.id === id && t.userId === userId) ?? null;
        },

        async save(task: TaskDomain, userId: string) {
            const created: TaskModel = {
                ...task,
                userId,
                id: crypto.randomUUID(),
                status: 'PENDING',
                startedAt: null,
                finishedAt: null,
                cancelledAt: null,
                actualDurationSec: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            tasks.push(created);
            return created;
        },

        async findAll() {
            return tasks;
        },

        async delete(id: string) {
            const index = tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                tasks.splice(index, 1);
            }
        },
        async findAllByRoutineId(routineId: string, userId: string) {
            return tasks.filter(t => t.routineId === routineId && t.userId === userId);
        }

    }
}
