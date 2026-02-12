import { TaskModel } from "@modules/task/domain"
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository"
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine"
import { TaskService } from "@modules/task/services/task.service"
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository"
import { RoutineModel } from "src/modules/routine/types/routine.types"


describe("Pause Task Integration Test", () => {

    it("should pause a task and accumulate 10 minutes", async () => {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000) // 10 minutos atrás

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
            startedAt: tenMinutesAgo,
            finishedAt: null,
            cancelledAt: null,
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const routine: RoutineModel = {
            id: "routine-1",
            userId: "user-1",
            status: 'INPROGRESS',
            date: new Date(),
            startedAt: new Date(),
            finishedAt: null,
            cancelledAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([routine])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        const task = await taskService.pause("1", "user-1")

        expect(task.status).toBe('PAUSED')
        const updatedTask = await repository.findById("1", "user-1")
        console.log(`Tempo acumulado: ${updatedTask?.actualDurationSec}s (esperado: ~600s)`)
        expect(updatedTask?.actualDurationSec).toBeGreaterThanOrEqual(599)
        expect(updatedTask?.actualDurationSec).toBeLessThanOrEqual(601)
    })

    it("should accumulate duration across multiple start/pause cycles (5min + 10min + 3min = 18min)", async () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

        const mockTask: TaskModel = {
            id: "1",
            userId: "user-1",
            content: "Test task",
            status: 'INPROGRESS',
            routineId: "routine-1",
            category: 'WORK',
            plannedStart: new Date(),
            plannedEnd: new Date(Date.now() + 3600000),
            durationSec: 3600,
            startedAt: fiveMinutesAgo,
            finishedAt: null,
            cancelledAt: null,
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const routine: RoutineModel = {
            id: "routine-1",
            userId: "user-1",
            status: 'INPROGRESS',
            date: new Date(),
            startedAt: new Date(),
            finishedAt: null,
            cancelledAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const repository = InMemoryTaskRepository([mockTask])
        const routineRepository = InMemoryRoutineRepository([routine])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        // === Sessão 1: 5 minutos ===
        await taskService.pause("1", "user-1")
        let task = await repository.findById("1", "user-1")
        console.log(`Sessão 1 (5min): ${task?.actualDurationSec}s`)
        expect(task?.actualDurationSec).toBeGreaterThanOrEqual(299)
        expect(task?.actualDurationSec).toBeLessThanOrEqual(301)

        // === Sessão 2: start + simular 10 minutos ===
        await taskService.start("1", "user-1")
        // Simular que startedAt foi 10 minutos atrás
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
        await repository.update("1", { startedAt: tenMinutesAgo } as any, "user-1")

        await taskService.pause("1", "user-1")
        task = await repository.findById("1", "user-1")
        console.log(`Sessão 2 (5+10=15min): ${task?.actualDurationSec}s`)
        expect(task?.actualDurationSec).toBeGreaterThanOrEqual(899)
        expect(task?.actualDurationSec).toBeLessThanOrEqual(901)

        // === Sessão 3: start + simular 3 minutos ===
        await taskService.start("1", "user-1")
        const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000)
        await repository.update("1", { startedAt: threeMinutesAgo } as any, "user-1")

        await taskService.pause("1", "user-1")
        task = await repository.findById("1", "user-1")
        console.log(`Sessão 3 (5+10+3=18min): ${task?.actualDurationSec}s`)
        expect(task?.actualDurationSec).toBeGreaterThanOrEqual(1079)
        expect(task?.actualDurationSec).toBeLessThanOrEqual(1081)

        console.log(`✅ Tempo total acumulado: ${task?.actualDurationSec}s (~${Math.round((task?.actualDurationSec ?? 0) / 60)}min)`)
    })

    it("should not pause a task if it is not in progress", async () => {
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
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        await expect(taskService.pause("1", "user-1")).rejects.toThrow("Task is not running")
    })
})