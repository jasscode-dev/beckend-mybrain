
import { TaskService } from "src/services/task.service";
import { InMemoryRoutineRepository } from "../repositories/in.memory.routine";
import { InMemoryTaskRepository } from "../repositories/in.memory.task.repository";

;
import { InMemoryUserRepository } from "../repositories/in.memory.user.repository";
import { TaskModel } from "src/types/task.type";


describe('Create Task',  () => {

it('should  NOT start task if it belongs to an routine with status incomplete ', async () => {
        const mockRoutine = {
            id: "routine-1",
            userId: "user-1",
            date: new Date(),
            status: 'INCOMPLETE' as const,
            cancelledAt: null,
            finishedAt: null,
            startedAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const mockTask: TaskModel = {
            id: "2",
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
        const routineRepository = InMemoryRoutineRepository([mockRoutine])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)




       await expect(
         taskService.start('2','user-1')
       ).rejects.toThrow('Cannot start a INCOMPLETE routine.')


    })
})










