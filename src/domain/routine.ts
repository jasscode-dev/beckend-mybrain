import { normalize } from "node:path";
import { AppError } from "src/errors/appError";
import { RoutineDomain, RoutineStatus } from "src/types/routine.type";
import { TaskDomain } from "src/types/task.type";
import { normalizeDate } from "src/utils/date";





const itsValidDay = (routineDate: Date, now: Date): boolean => {

    return routineDate.getTime() >= now.getTime();
}


export const Routine = {

    /* itsValidDay: (routine: RoutineDomain, date: Date, now: Date) => {

        const routineDate = normalizeDate(routine.date)
        const today = normalizeDate(now)
        console.log("routineDate", routineDate)
        console.log("today", today)
        if (routineDate.getTime() < today.getTime()) {
            return false
        }
        return true
    }, */
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
        if (!itsValidDay(routine.date, now)) {
            throw new AppError("Cannot start a routine from a past date.");
        }
        if (routine.status === 'COMPLETED' || routine.status === 'INCOMPLETE') {
            throw new AppError(`Cannot start a ${routine.status} routine.`);
        }

        if (routine.status === 'INPROGRESS') {
            return routine
        }

        return {
            ...routine,
            status: 'INPROGRESS' as const,
            startedAt: now,
        };
    },

    finish: (routine: RoutineDomain, now: Date, totalTaskDone: number): RoutineDomain => {
        if (routine.status !== 'INPROGRESS') {
            throw new AppError("Routine can only be finished if it is in progress.");
        }

        if (routine.tasks.length === totalTaskDone) {
            routine.status = 'COMPLETED'
            routine.finishedAt = now
        }

        return {
            ...routine,

        };
    },

    makeIncomplete: (routine: RoutineDomain, now: Date): RoutineDomain => {
        if (routine.status === 'COMPLETED') {
            throw new AppError("Cannot make incomplete a completed routine.");
        }

        return {
            ...routine,
            status: 'INCOMPLETE' as const,
            cancelledAt: now,
        };
    },

    addTask: (routine: RoutineDomain, task: TaskDomain, now: Date): RoutineDomain => {


        if (!itsValidDay(routine.date, now)) {
            throw new AppError("Cannot add tasks to a past routine.")
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

    unmarkTask: (routine: RoutineDomain): RoutineDomain => {
        if (routine.status === 'COMPLETED') {
            return {
                ...routine,
                status: 'INPROGRESS' as const,
                finishedAt: null,
            }
        }
        return routine;
    }


};
