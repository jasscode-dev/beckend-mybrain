import { TaskResponse } from "src/modules/task/domain"
import { InMemoryTaskRepository } from "../repositories/in.memory.task.repository"
import { InMemoryRoutineRepository } from "../repositories/in.memory.routine"
import { TaskService } from "@modules/task/services/task.service"


describe("Pause Task Integration Test", () => {

    it("should pause a task", async () => {
        const mockTask: TaskResponse = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'INPROGRESS',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: new Date(),
            plannedEnd: new Date(),
            durationSec: 3600,
            startedAt: new Date(),
            finishedAt: null,
            cancelledAt: null,
            totalSeconds: 0,
            actualDurationSec: 0,
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([])
        const taskService = TaskService(repository, routineRepository)

        // Simular que a task começou há 10 segundos
        const startedAt = new Date()
        startedAt.setSeconds(startedAt.getSeconds() - 10)

        await repository.update("1", {
            startedAt,
            totalSeconds: 0
        } as any)

        const task = await taskService.pause("1")

        expect(task.status).toBe('PAUSED')
        // Esperamos pelo menos 10 segundos acumulados
        // findById para pegar os dados completos do repositório in-memory
        const updatedTask = await repository.findById("1")
        expect((updatedTask as any).totalSeconds).toBeGreaterThanOrEqual(10)
    })

    it("should not pause a task if it is not in progress", async () => {
        const mockTask: TaskResponse = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'PENDING',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: new Date(),
            plannedEnd: new Date(),
            durationSec: 3600,
            startedAt: null,
            finishedAt: null,
            cancelledAt: null, 
            totalSeconds: 0,
            actualDurationSec: 0,
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([])
        const taskService = TaskService(repository, routineRepository)

        await expect(taskService.pause("1")).rejects.toThrow("Task is not running")
    })
})