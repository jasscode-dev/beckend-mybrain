import { normalize } from "node:path";
import { RoutineDomain, RoutineStatus } from "src/types/routine.type";
import { TaskDomain } from "src/types/task.type";
import { normalizeDate } from "src/utils/date";
import { th } from "zod/v4/locales";

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

    finish: (routine: RoutineDomain, now: Date, totalTaskDone: number): RoutineDomain => {
        if (routine.status !== 'INPROGRESS') {
            throw new Error("Routine can only be finished if it is in progress.");
        }

        if (routine.tasks.length === totalTaskDone) {
            routine.status = 'COMPLETED'
            routine.finishedAt = now
        }

        return {
            ...routine,

        };
    },

    cancel: (routine: RoutineDomain, now: Date): RoutineDomain => {
        if (routine.status === 'COMPLETED') {
            throw new Error("Cannot cancel a completed routine.");
        }

        return {
            ...routine,
            status: 'INCOMPLETE' as const,
            cancelledAt: now,
        };
    },

    addTask: (routine: RoutineDomain, task: TaskDomain, now: Date): RoutineDomain => {

        const routineDate = normalizeDate(routine.date)
        const today = normalizeDate(now)
        if (routineDate < today) {
            throw new Error("Cannot add tasks to a past routine.")
        }

        if (routine.status == 'COMPLETED') {
            routine.status = 'INPROGRESS'
            routine.finishedAt = null

        }

        return {
            ...routine,
            tasks: [...routine.tasks, task],

        };
    },
};
