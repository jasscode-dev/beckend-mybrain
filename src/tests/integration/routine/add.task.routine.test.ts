
import { RoutineController } from "@modules/routine/controllers/routine.controller";
import { RoutineService } from "@modules/routine/services/routine.service";
import { TaskInput } from "@modules/task/domain";
import { InMemoryRoutineRepository } from "src/tests/repositories/in.memory.routine";
import { InMemoryTaskRepository } from "src/tests/repositories/in.memory.task.repository";

// Mock Request and Response
const mockRequest = (params: any, body: any) => ({
    params,
    body
}) as any;

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Add Task to Routine via Date Route', () => {
    let routineRepository: any;
    let taskRepository: any;
    let routineController: any;

    beforeEach(() => {
        routineRepository = InMemoryRoutineRepository([]);
        taskRepository = InMemoryTaskRepository();
        routineController = RoutineController(routineRepository, taskRepository);
    });

    it('should create a routine if it does not exist and add the task', async () => {
        const date = '2026-02-13';
        const taskInput = {
            content: 'New Task',
            plannedStart: '2026-02-13T10:00:00Z',
            plannedEnd: '2026-02-13T11:00:00Z',
            category: 'WORK'
        };

        const req = mockRequest({ date }, taskInput);
        const res = mockResponse();

        await routineController.addTask(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith("ok");

        const routine = await routineRepository.findByUserAndDay('ckxq9kz3v0000z8m1f3q9p8a1', new Date(date));
        expect(routine).toBeDefined();

        // Check if task was added
        const tasks = await taskRepository.findAllByRoutineId(routine.id, 'ckxq9kz3v0000z8m1f3q9p8a1');
        expect(tasks).toHaveLength(1);
        expect(tasks[0].content).toBe('New Task');
    });

    it('should add a task to an existing routine', async () => {
        const date = '2026-02-13';

        // Pre-create routine
        const routine = await routineRepository.save(new Date(date), 'ckxq9kz3v0000z8m1f3q9p8a1');

        const taskInput = {
            content: 'Second Task',
            plannedStart: '2026-02-13T12:00:00Z',
            plannedEnd: '2026-02-13T13:00:00Z',
            category: 'STUDY'
        };

        const req = mockRequest({ date }, taskInput);
        const res = mockResponse();

        await routineController.addTask(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

        const tasks = await taskRepository.findAllByRoutineId(routine.id, 'ckxq9kz3v0000z8m1f3q9p8a1');
        expect(tasks).toHaveLength(1);
        expect(tasks[0].content).toBe('Second Task');
    });
});
