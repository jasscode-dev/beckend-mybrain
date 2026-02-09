import { TaskModel } from "@modules/task/domain"

import { TaskService } from "@modules/task/services/task.service"
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine"
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository"
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository"


describe("Done Task Integration Test", () => {

    it("should complete a task from PENDING", async () => {
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
        const routineRepository = InMemoryRoutineRepository([
            {
                id: "routine-1",
                userId: "user-1",
                date: new Date(),
                routineStatus: 'PENDING',
                totalTasks: 1,
                completedTasks: 0,
                completionRate: 0,
                starEarned: false,
                xpEarned: 0,
                tasks: [],
                totalHoursPlanned: 1,
                completedHoursPlanned: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
        const userRepository = InMemoryUserRepository([{
            userId: "user-1",
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            xp: 0,
            level: 1,
            stars: 0,
            tulips: 0,
            routines: [],
            createdAt: new Date(),
            updatedAt: new Date()


        }])
        const taskService = TaskService(repository, routineRepository, userRepository)



        const task = await taskService.done("1", "user-1")

        expect(task.status).toBe('DONE')

        const updatedTask = await repository.findById("1", "user-1")
        expect((updatedTask as any).finishedAt).toBeDefined()
        expect((updatedTask as any).status).toBe('DONE')

        const updatedRoutine = await routineRepository.findById("routine-1", "user-1")
        expect(updatedRoutine?.routineStatus).toBe('DONE')
        expect(updatedRoutine?.completedTasks).toBe(1)

        const updatedUser = await userRepository.findById("user-1")
        expect(updatedUser?.xp).toBeGreaterThan(0)
        expect(updatedUser?.stars).toBe(1)

    })

    it("should complete a task from INPROGRESS and calculate final time", async () => {
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
        const routineRepository = InMemoryRoutineRepository([
            {
                id: "routine-1",
                userId: "user-1",
                date: new Date(),
                routineStatus: 'PENDING',
                totalTasks: 1,
                completedTasks: 0,
                completionRate: 0,
                starEarned: false,
                xpEarned: 0,
                tasks: [],
                totalHoursPlanned: 1,
                completedHoursPlanned: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
        const userRepository = InMemoryUserRepository([{
            userId: "user-1",
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            xp: 0,
            level: 1,
            stars: 0,
            tulips: 0,
            routines: [],
            createdAt: new Date(),
            updatedAt: new Date()




        }])
        const taskService = TaskService(repository, routineRepository, userRepository)

        const startedAt = new Date()
        startedAt.setSeconds(startedAt.getSeconds() - 30)

        await repository.update("1", {
            startedAt,
            totalSeconds: 0
        } as any, "user-1")

        const task = await taskService.done("1", "user-1")

        expect(task.status).toBe('DONE')

        const updatedTask = await repository.findById("1", "user-1")
        expect((updatedTask as any).actualDurationSec).toBeGreaterThanOrEqual(30)
        expect((updatedTask as any).finishedAt).toBeDefined()

        const updatedRoutine = await routineRepository.findById("routine-1", "user-1")
        console.log("routine", updatedRoutine)
        expect(updatedRoutine?.routineStatus).toBe('DONE')
        expect(updatedRoutine?.completedTasks).toBe(1)


        const updatedUser = await userRepository.findById("user-1")
        console.log("user", updatedUser)
        expect(updatedUser?.xp).toBeGreaterThan(0)
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
            totalSeconds: 3680,
            actualDurationSec: 3680,
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
