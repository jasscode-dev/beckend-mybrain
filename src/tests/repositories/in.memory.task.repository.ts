import { TaskDomain, TaskResponse } from "@modules/task/domain";
import { ITaskRepository } from "@modules/task/repositories";



export const InMemoryTaskRepository = (initialTasks: TaskResponse[] = []): ITaskRepository => {
    const tasks: TaskResponse[] = [...initialTasks]

    return {
        async update(id: string, task: Partial<TaskDomain>) {
            const index = tasks.findIndex(t => t.id === id);
            if (index === -1) throw new Error("Task not found");

            const updatedTask = {
                ...tasks[index],
                ...task,
            } as TaskResponse;

            tasks[index] = updatedTask;
            return updatedTask;
        },

        async findById(id: string) {
            return tasks.find(t => t.id === id) ?? null;
        },

        async save(task: TaskDomain) {
            const created: TaskResponse = {
                ...task,
                id: crypto.randomUUID(),
            } as TaskResponse;

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
        }
    }
}
