import { TaskModel } from "@modules/task/domain";
import { TaskService } from "@modules/task/services/task.service";
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine";
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository";
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository";
import { RoutineModel } from "@modules/routine/domain";

describe("Add XP Integration Test", () => {

    it("should add XP and the  onTime bonus ", async () => {
        const now = new Date()
        const later = new Date(now.getTime() + 3600000) // 1 hora depois

        const mockTask: TaskModel = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'INPROGRESS',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: now,
            plannedEnd: later,
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

        const user = await userRepository.findById("user-1")
        console.log("User after completing task:", user)
        expect(user?.xp).toBe(14) // Verifica se o XP foi adicionado corretamente

    })
    it("should add XP without onTime bonus ", async () => {
        const now = new Date()
        const past = new Date(now.getTime() - 100)

        const mockTask: TaskModel = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'PENDING',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: new Date(past.getTime() - 3600000),
            plannedEnd: past,
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

        const user = await userRepository.findById("user-1")
        console.log("User after completing task:", user)
        expect(user?.xp).toBe(11)

    })
    it("should up level when XP threshold is met", async () => {
        const now = new Date()
        const later = new Date(now.getTime() + 3600000)

        const mockTasks: TaskModel[] = Array.from({ length: 15 }, (_, i) => ({
            id: String(i + 1),
            userId: "user-1",
            content: `Task ${i + 1}`,
            status: 'PENDING' as const,
            routineId: String(i + 1),
            category: 'WORK' as const,
            plannedStart: now,
            plannedEnd: later,
            durationSec: 3600,
            startedAt: null,
            finishedAt: null,
            cancelledAt: null,
            totalSeconds: 0,
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }))
        const mokRoutines: RoutineModel[] = Array.from({ length: 15 }, (_, i) => ({
            id: String(i + 1),
            userId: "user-1",
            date: new Date(),
            routineStatus: 'PENDING' as const,
            totalTasks: 1,
            completedTasks: 0,
            completionRate: 0,
            starEarned: false,
            xpEarned: 0,
            tasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }))

        const repository = InMemoryTaskRepository(mockTasks)
        const routineRepository = InMemoryRoutineRepository(mokRoutines)
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
        for (let i = 1; i <= 15; i++) {
            await taskService.done(String(i), "user-1")
        }

        {

            const user = await userRepository.findById("user-1")
            console.log("User after completing task:", user)
            expect(user?.level).toBe(2)
            expect(user?.xp).toBe(10)


        }    })
});