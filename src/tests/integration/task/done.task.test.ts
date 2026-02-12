import { TaskModel } from "@modules/task/domain"

import { TaskService } from "@modules/task/services/task.service"
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine"
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository"
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository"


describe("Done Task Integration Test", () => {

    it("should complete a PENDING task with 0 XP (no time worked)", async () => {
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
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([
            {
                id: "routine-1",
                userId: "user-1",
                date: new Date(),
                status: 'PENDING',
                cancelledAt: null,
                finishedAt: null,
                startedAt: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], repository)
        const userRepository = InMemoryUserRepository([{
            userId: "user-1",
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            xp: 0,
            level: 1,
            stars: 0,
            tulips: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }])
        const taskService = TaskService(repository, routineRepository, userRepository)

        const task = await taskService.done("1", "user-1")

        expect(task.status).toBe('DONE')
        expect(task.actualDurationSec).toBe(0)

        const user = await userRepository.findById("user-1")
        expect(user?.xp).toBe(0) // sem trabalho = 0 XP
    })

    it("should complete a task from INPROGRESS and calculate final time", async () => {
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 3600000)
        const later = new Date(now.getTime() + 3600000)

        const mockTask: TaskModel = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'INPROGRESS',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: oneHourAgo,
            plannedEnd: later,
            durationSec: 3600,
            startedAt: oneHourAgo, // começou 1h atrás → 100% do tempo
            finishedAt: null,
            cancelledAt: null,
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([
            {
                id: "routine-1",
                userId: "user-1",
                date: new Date(),
                status: 'PENDING',
                cancelledAt: null,
                finishedAt: null,
                startedAt: null,
                tasks: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], repository)
        const userRepository = InMemoryUserRepository([{
            userId: "user-1",
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            xp: 0,
            level: 1,
            stars: 0,
            tulips: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }])
        const taskService = TaskService(repository, routineRepository, userRepository)

        const task = await taskService.done("1", "user-1")

        expect(task.status).toBe('DONE')

        const updatedTask = await repository.findById("1", "user-1")
        // actualDurationSec é limitado ao durationSec (3600)
        expect(updatedTask?.actualDurationSec).toBe(3600)
        expect(updatedTask?.finishedAt).toBeDefined()

        const updatedRoutine = await routineRepository.findById("routine-1", "user-1")
        expect(updatedRoutine?.status).toBe('DONE')

        const updatedUser = await userRepository.findById("user-1")
        expect(updatedUser?.xp).toBe(14) // 10 base + 3 onTime + 1 WORK
        expect(updatedUser?.stars).toBe(1)
    })

    it("should not complete a task if it is already done", async () => {
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
            actualDurationSec: 3600,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        await expect(taskService.done("1", "user-1")).rejects.toThrow("Task is already done")
    })
})
