import {    TaskModel } from "@modules/task/domain"
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository"
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine"
import { TaskService } from "@modules/task/services/task.service"
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository"

describe("Start Task Integration Test", () => {

    it("should start a task", async () => {
        const mockTask: TaskModel = {
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
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository,userRepository)

        const task = await taskService.start("1","user-1")

        expect(task.status).toBe('INPROGRESS')

        const updatedTask = await repository.findById("1","user-1")
        expect((updatedTask as any).startedAt).toBeDefined()
    })

    it("should not start a task if it is already in progress", async () => {
        const mockTask: TaskModel = {
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
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository,userRepository)

        await expect(taskService.start("1","user-1")).rejects.toThrow("Task is already running")
    })

    it("should not start a task if it is already done", async () => {
        const mockTask: TaskModel = {
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
            totalSeconds: 3600,
            actualDurationSec: 3600,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([]) 
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository,userRepository)

        await expect(taskService.start("1","user-1")).rejects.toThrow("Task is already done")
    })
})
