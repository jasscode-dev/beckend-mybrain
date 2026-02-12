import { TaskService } from "@modules/task/services/task.service";
import { InMemoryRoutineRepository } from "../../repositories/in.memory.routine";
import { InMemoryTaskRepository } from "../../repositories/in.memory.task.repository";

;
import { InMemoryUserRepository } from "../../repositories/in.memory.user.repository";


describe('Create Task', () => {


    it('should create a new task and create a routine', async () => {
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)


        const input = {
            content: 'Task 1',
            plannedStart: new Date('2023-10-27T08:00:00Z'),
            plannedEnd: new Date('2023-10-27T09:00:00Z'),
            category: "WORK" as const,

        }

        const task = await taskService.create(input, "user-1")


        const savedTask = await repository.findById(task.id, "user-1")


        expect(savedTask?.routineId).toBeDefined()
        expect(savedTask?.content).toBe(input.content)
        expect(savedTask?.status).toBe('PENDING')
        expect(savedTask?.routineId).toBe(task.routineId)


    })

    it('should NOT create a new routine if one already exists for the same day', async () => {
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)
        const input = {
            content: 'Task 1',
            plannedStart: new Date('2023-10-27T08:00:00Z'),
            plannedEnd: new Date('2023-10-27T09:00:00Z'),
            category: "WORK" as const,

        }
        const task1 = await taskService.create(input, "user-1")
        const task2 = await taskService.create({
            ...input,
            content: 'Task 2',

        }, "user-1")

        const routines = await routineRepository.findAllByUser('user-1')

        expect(routines).toHaveLength(1)
        expect(task1.routineId).toBe(task2.routineId)

    })
    it('should create different routines for different days', async () => {
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)
        await taskService.create({
            content: 'Task day 1',
            plannedStart: new Date('2023-10-27T08:00:00Z'),
            plannedEnd: new Date('2023-10-27T09:00:00Z'),
            category: "WORK" as const,

        }, "user-1")
        const taskDay2 = await taskService.create({
            content: 'Task day 2',
            plannedStart: new Date('2023-10-28T08:00:00Z'),
            plannedEnd: new Date('2023-10-28T09:00:00Z'),
            category: "WORK" as const,

        }, "user-1")


        const routines = await routineRepository.findAllByUser('user-1')
        expect(routines).toHaveLength(2)
        expect(taskDay2.routineId).not.toBeNull()

    })

    it('should calculate task duration correctly', async () => {
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        const task = await taskService.create({
            content: 'Task',
            plannedStart: new Date('2023-10-27T08:00:00Z'),
            plannedEnd: new Date('2023-10-27T09:30:00Z'),
            category: "WORK" as const,

        }, "user-1")

        expect(task.durationSec).toBe(90 * 60)
    })
    it('should throw error if plannedEnd is before plannedStart', async () => {
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        await expect(
            taskService.create({
                content: 'Invalid Task',
                plannedStart: new Date('2023-10-27T10:00:00Z'),
                plannedEnd: new Date('2023-10-27T09:00:00Z'),
                category: "WORK" as const,

            }, "user-1")
        ).rejects.toThrow()
    })
    it('should create separate routines for different users on the same day', async () => {
        const repository = InMemoryTaskRepository()
        const routineRepository = InMemoryRoutineRepository([])
        const userRepository = InMemoryUserRepository([])
        const taskService = TaskService(repository, routineRepository, userRepository)

        const input = {
            content: 'Task',
            plannedStart: new Date('2023-10-27T08:00:00Z'),
            plannedEnd: new Date('2023-10-27T09:00:00Z'),
            category: "WORK" as const,

        }

        const task1 = await taskService.create(input, "user-1")
        const task2 = await taskService.create({
            ...input,

        }, "user-2")

        expect(task1.routineId).not.toEqual(task2.routineId)
    })












})  