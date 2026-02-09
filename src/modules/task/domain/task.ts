import { TaskDomain, TaskInput } from "./task.types"

export const taskDomain = {
    create: (input: TaskInput, routineId: string): TaskDomain => {
        const plannedStart = new Date(input.plannedStart)
        const plannedEnd = new Date(input.plannedEnd)

        if (!input.content || input.content.trim().length < 2) {
            throw new Error("Content must have at least 2 characters")
        }

        if (
            Number.isNaN(plannedStart.getTime()) ||
            Number.isNaN(plannedEnd.getTime())
        ) {
            throw new Error("Invalid date format")
        }

        if (plannedEnd.getTime() <= plannedStart.getTime()) {
            throw new Error("PlannedEnd must be after plannedStart")
        }

        const durationSec = Math.floor((plannedEnd.getTime() - plannedStart.getTime()) / 1000)

        return Object.freeze({
            content: input.content,
            status: 'PENDING',
            routineId,
            plannedStart,
            plannedEnd,
            durationSec,
            totalSeconds: 0,
            startedAt: null,
            finishedAt: null,
            cancelledAt: null,
            actualDurationSec: 0,
            category: input.category,
        })
    },

    start: (task: TaskDomain, now: Date) => {
        if (task.status === 'DONE') throw new Error("Task is already done")
        if (task.status === 'INPROGRESS') throw new Error("Task is already running")

        return {
            ...task,
            status: 'INPROGRESS' as const,
            startedAt: now,
        }
    },

    pause: (task: TaskDomain, now: Date) => {
        if (task.status !== 'INPROGRESS') throw new Error("Task is not running")
        if (!task.startedAt) throw new Error("Task is not running")

        const difSec = Math.floor((now.getTime() - task.startedAt.getTime()) / 1000)
        const totalSeconds = task.totalSeconds + difSec

        return {
            ...task,
            status: 'PAUSED' as const,
            startedAt: null,
            totalSeconds,
        }
    },

    done: (task: TaskDomain, now: Date): TaskDomain => {
        if (task.status === 'DONE') throw new Error("Task is already done")

        const finishedAt = now
        let totalSeconds = task.totalSeconds

        if (task.status === 'INPROGRESS' && task.startedAt) {
            totalSeconds += Math.floor((finishedAt.getTime() - task.startedAt.getTime()) / 1000)
        }

        return {
            ...task,
            status: 'DONE' as const,
            finishedAt,
            startedAt: null,
            totalSeconds,
            actualDurationSec: totalSeconds,
        }
    },

    cancel: (task: TaskDomain, now: Date) => {
        if (task.status === 'DONE') throw new Error("Task is already done")

        return {
            ...task,
            status: 'CANCELLED' as const,
            cancelledAt: now,
        }
    },
}
