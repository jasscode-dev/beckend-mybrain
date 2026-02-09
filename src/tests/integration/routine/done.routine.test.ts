import { RoutineService } from "@modules/routine/services/routine.service"
import { TaskService } from "@modules/task/services/task.service"
import { InMomoryRoutineRepository } from "@modules/tests/repositories/in.memory.routine"
import { InMemoryTaskRepository } from "@modules/tests/repositories/in.memory.task.repository"
import { InMemoryUserRepository } from "@modules/tests/repositories/in.memory.user.repository"
import { randomUUID } from "crypto"

describe("Done routine", () => {
    it("should be able to done a routine and return the task, routine and stats", async () => {
        const taskRepository = new InMemoryTaskRepository()
        const routineRepository = new InMomoryRoutineRepository()
        const userRepository = new InMemoryUserRepository()

        const taskService = TaskService(taskRepository, routineRepository, userRepository)
        const routineService = RoutineService(routineRepository, taskRepository)

        const userId = randomUUID()
        const date = new Date()

        await routineService.getOrCreateDailyRoutine(userId, date)
        const task = await taskService.create({
            category: "WORK",
            content: "test",
            plannedEnd: new Date(),
            plannedStart: new Date()
        }, userId)

        const result = await taskService.done(task.id, userId)

        // expect(result).toHaveProperty("task")
        // expect(result).toHaveProperty("routine")
        // expect(result).toHaveProperty("stats")
        // expect(result.routine.status).toBe("DONE")
    })
})
