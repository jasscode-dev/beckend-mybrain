import { RoutineDomain, RoutineStatus } from "src/types/routine.type";
import { TaskDomain } from "src/types/task.type";

export const Routine = {
    create: (date: Date): RoutineDomain => {
        if (Number.isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }

        return Object.freeze({
            date,
            status: 'PENDING' as RoutineStatus,
            tasks: [],
            startedAt: null,
            finishedAt: null,
            cancelledAt: null,
        });
    },

    start: (routine: RoutineDomain, now: Date): RoutineDomain => {
        if (routine.status !== 'PENDING') {
            throw new Error("Routine can only be started if it is pending.");
        }

        return {
            ...routine,
            status: 'INPROGRESS' as const,
            startedAt: now,
        };
    },

    finish: (routine: RoutineDomain, now: Date): RoutineDomain => {
        if (routine.status !== 'INPROGRESS') {
            throw new Error("Routine can only be finished if it is in progress.");
        }

        const allTasksDone = routine.tasks.every(task => task.status === 'DONE');

        return {
            ...routine,
            status: allTasksDone ? ('DONE' as const) : ('INCOMPLETE' as const),
            finishedAt: now,
        };
    },

    cancel: (routine: RoutineDomain, now: Date): RoutineDomain => {
        if (routine.status === 'DONE') {
            throw new Error("Cannot cancel a completed routine.");
        }

        return {
            ...routine,
            // Per schema, there is no CANCELLED status for a Routine, so INCOMPLETE is used.
            status: 'INCOMPLETE' as const,
            cancelledAt: now,
        };
    },

    addTask: (routine: RoutineDomain, task: TaskDomain): RoutineDomain => {
        if (routine.status !== 'PENDING') {
            throw new Error("Tasks can only be added to a pending routine.");
        }
        return {
            ...routine,
            tasks: [...routine.tasks, task],
        };
    },
};
