import { TaskResponse } from "@modules/task/domain"
import { InMemoryTaskRepository } from "../repositories/in.memory.task.repository"
import { InMemoryRoutineRepository } from "../repositories/in.memory.routine"
import { TaskService } from "@modules/task/services/task.service"


describe("Done Task Integration Test", () => {

    it("should complete a task from PENDING", async () => {
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

        const task = await taskService.done("1")

        expect(task.status).toBe('DONE')

        const updatedTask = await repository.findById("1")
        expect((updatedTask as any).finishedAt).toBeDefined()
        expect((updatedTask as any).status).toBe('DONE')
    })

    it("should complete a task from INPROGRESS and calculate final time", async () => {
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

        const startedAt = new Date()
        startedAt.setSeconds(startedAt.getSeconds() - 30)

        await repository.update("1", {
            startedAt,
            totalSeconds: 0
        } as any)

        const task = await taskService.done("1")

        expect(task.status).toBe('DONE')

        const updatedTask = await repository.findById("1")
        expect((updatedTask as any).actualDurationSec).toBeGreaterThanOrEqual(30)
        expect((updatedTask as any).finishedAt).toBeDefined()
    })

    it("should not complete a task if it is already done", async () => {
        const mockTask: TaskResponse = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'DONE',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: new Date(),
            plannedEnd: new Date(),
            durationSec: 3600,
            startedAt: null,
            cancelledAt: null,
            finishedAt: new Date(),
            totalSeconds: 3680,
            actualDurationSec: 3680,
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([])
        const taskService = TaskService(repository, routineRepository)

        await expect(taskService.done("1")).rejects.toThrow("Task is already done")
    })
})
