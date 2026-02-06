import { TaskDomain, TaskInput } from "./task.types"

export const taskDomain = {
    create: (input: TaskInput, routineId: string): TaskDomain => {
        const plannedStart = new Date(input.plannedStart)
        const plannedEnd = new Date(input.plannedEnd)

        if (!input.content || input.content.trim().length < 2) {
            throw new Error("Content must have at least 2 characters")
        }

        if (plannedEnd.getTime() <= plannedStart.getTime()) {
            throw new Error("PlannedEnd must be after plannedStart")
        }
        if (
            Number.isNaN(plannedStart.getTime()) ||
            Number.isNaN(plannedEnd.getTime())
        ) {
            throw new Error("Invalid date format")
        }
        const durationSec = (plannedEnd.getTime() - plannedStart.getTime()) / 1000

        return Object.freeze({
            userId: input.userId,
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
    start: (task: TaskDomain) => {
        if (task.status === 'DONE') {
            throw new Error("Task is already done")
        }
        if (task.status === 'INPROGRESS') {
            throw new Error("Task is already running")
        }
        return {
            ...task,
            status: 'INPROGRESS' as const,
            startedAt: new Date(),

        }

    },
    pause: (task: TaskDomain) => {
        if (task.status !== 'INPROGRESS') {
            throw new Error("Task is not running")
        }
        if (!task.startedAt) {
            throw new Error("Task is not running")
        }
        const now = new Date()

        const difSec = Math.floor((now.getTime() - task.startedAt.getTime()) / 1000)
        const totalSeconds = task.totalSeconds + difSec
        return {
            ...task,
            status: 'PAUSED' as const,
            startedAt: null,
            totalSeconds,

        }
    },
    done: (task: TaskDomain) => {
        if (task.status === 'DONE') {
            throw new Error("Task is already done")
        }

        let totalSeconds = task.totalSeconds
        let finishedAt = new Date()
        if (task.status === 'INPROGRESS' && task.startedAt) {
            totalSeconds += Math.floor(
                (finishedAt.getTime() - task.startedAt.getTime()) / 1000
            )
        }

        return {
            ...task,
            status: 'DONE' as const,
            finishedAt: new Date(),
            startedAt: null,
            duration: task.durationSec,
            totalSeconds,
            actualDurationSec: totalSeconds,

        }
    },
    cancel: (task: TaskDomain) => {
        if (task.status === 'DONE') {
            throw new Error("Task is already done")
        }
        return {
            ...task,
            status: 'CANCELLED' as const,
            cancelledAt: new Date(),



        }
    },


}

