import { TaskModel } from "@modules/task/domain";
import { TaskService } from "@modules/task/services/task.service";
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine";
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository";
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository";
import { RoutineModel } from "@modules/routine/types/routine.types";

describe("Add XP Integration Test", () => {

    it("should add XP and the onTime bonus", async () => {
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 3600000)
        const later = new Date(now.getTime() + 3600000) // plannedEnd 1h no futuro

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
            startedAt: oneHourAgo, // começou 1h atrás → sessão = 3600s = 100%
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
                startedAt: null,
                finishedAt: null,
                cancelledAt: null,
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
        await taskService.done("1", "user-1")

        const user = await userRepository.findById("user-1")
        // 100% do tempo + onTime + WORK bonus = 10 + 3 + 1 = 14
        expect(user?.xp).toBe(14)
    })

    it("should add XP without onTime bonus (finished after plannedEnd)", async () => {
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 3600000)
        const past = new Date(now.getTime() - 100) // plannedEnd já passou

        const mockTask: TaskModel = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'INPROGRESS',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: new Date(past.getTime() - 3600000),
            plannedEnd: past, // prazo já passou → sem bônus onTime
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
                startedAt: null,
                finishedAt: null,
                cancelledAt: null,
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
        await taskService.done("1", "user-1")

        const user = await userRepository.findById("user-1")
        // 100% do tempo + WORK bonus, sem onTime = 10 + 1 = 11
        expect(user?.xp).toBe(11)
    })

    it("should up level when XP threshold is met", async () => {
        const now = new Date()
        const oneHourAgo = new Date(now.getTime() - 3600000)
        const later = new Date(now.getTime() + 3600000)

        const mockTasks: TaskModel[] = Array.from({ length: 15 }, (_, i) => ({
            id: String(i + 1),
            userId: "user-1",
            content: `Task ${i + 1}`,
            status: 'INPROGRESS' as const,
            routineId: String(i + 1),
            category: 'WORK' as const,
            plannedStart: oneHourAgo,
            plannedEnd: later,
            durationSec: 3600,
            startedAt: oneHourAgo, // 100% do tempo
            finishedAt: null,
            cancelledAt: null,
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
        const mokRoutines: RoutineModel[] = Array.from({ length: 15 }, (_, i) => ({
            id: String(i + 1),
            userId: "user-1",
            date: new Date(),
            status: 'PENDING' as const,
            startedAt: null,
            finishedAt: null,
            cancelledAt: null,
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const repository = InMemoryTaskRepository(mockTasks)
        const routineRepository = InMemoryRoutineRepository(mokRoutines, repository)
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
        for (let i = 1; i <= 15; i++) {
            await taskService.done(String(i), "user-1")
        }

        const user = await userRepository.findById("user-1")
        // 15 tasks × 14 XP (onTime + WORK) = 210 XP → level 2 com 10 XP restante
        expect(user?.level).toBe(2)
        expect(user?.xp).toBe(10)
    })
});