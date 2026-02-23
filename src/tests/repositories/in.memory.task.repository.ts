import { ITaskRepository } from "src/reposirories/task.repository";
import { TaskModel } from "src/types/task.type";
import { TaskDomain } from "src/types/task.type";



export const InMemoryTaskRepository = (initialTasks: TaskModel[] = []): ITaskRepository => {
    const tasks: TaskModel[] = [...initialTasks]

    return {
        async update(task: TaskDomain, userId: string, id: string) {
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

        async save(task: TaskDomain, userId: string, routineId: string) {
            const created: TaskModel = {
                ...task,
                userId,
                routineId,
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




    }
}
