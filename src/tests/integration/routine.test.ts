import e from "express"
import { error } from "node:console"
import { AppError } from "src/errors/appError"
import { RoutineService } from "src/services/routine.service"
import { TaskService } from "src/services/task.service"
import { InMemoryRoutineRepository } from "src/tests/repositories/in.memory.routine"
import { InMemoryTaskRepository } from "src/tests/repositories/in.memory.task.repository"
import { InMemoryUserRepository } from "src/tests/repositories/in.memory.user.repository"
import { TaskModel } from "src/types/task.type"




describe('Create routine', () => {
    it('Should create a routine if not exists', async () => {

        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const routineService = RoutineService(routineRepository, repository, userRepository)



        const input = {
            content: 'Task 1',
            plannedStart: new Date('2026-02-20T08:00:00Z'),
            plannedEnd: new Date('2026-02-20T09:00:00Z'),
            category: "WORK" as const,

        }

        const result1 = await routineService.create("user-1", input, new Date('2026-02-20T14:10:00Z'))

        const input2 = {
            content: 'Task 2',
            plannedStart: new Date('2026-02-20T11:00:00Z'),
            plannedEnd: new Date('2026-02-20T14:00:00Z'),
            category: "STUDY" as const,


        }
        const result2 = await routineService.create("user-1", input2, new Date('2026-02-20T00:00:00Z'))
        console.log(result1.routine.date)
        console.log(result2.routine.date)

        expect(result1.routine.id).toEqual(result2.routine.id)








    })
    it('Should completed routine if all tasks are done', async () => {
        const mockUser = {
            id: "user-1",
            name: "Test User",
            email: "test@example.com",
            password: "hashedpassword",
            xp: 0,
            level: 1,
            stars: 0,
            tulips: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
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
            finishedAt: null,
            cancelledAt: null,
            actualDurationSec: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const mockTask2: TaskModel = {
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
        const mockRoutine = {
            id: "routine-1",
            userId: "user-1",
            date: new Date(),
            status: 'INPROGRESS' as const,
            cancelledAt: null,
            finishedAt: null,
            startedAt: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }


        const repository = InMemoryTaskRepository([mockTask, mockTask2])
        const routineRepository = InMemoryRoutineRepository([mockRoutine])
        const userRepository = InMemoryUserRepository([mockUser])
        const routineService = RoutineService(routineRepository, repository, userRepository)
        const taskService = TaskService(repository, routineRepository, userRepository)




      
        const result = await taskService.done('2', 'user-1')
        expect(result.routine.status).toBe('COMPLETED')
        




    })

    it('Should NOT create routine if date in the past',async ()=>{


        
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const routineService = RoutineService(routineRepository, repository, userRepository)



        const input = {
            content: 'Task 1',
            plannedStart: new Date('2026-02-20T08:00:00Z'),
            plannedEnd: new Date('2026-02-20T09:00:00Z'),
            category: "WORK" as const,

        }


      await expect(
        routineService.create("user-1", input, new Date('2026-02-19T14:10:00Z'))
      ).rejects.toThrow("Cannot add tasks to a past routine.")



    
       

      

    })

})