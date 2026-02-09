
export type StatusTask = "PENDING" | "INPROGRESS" | "DONE" | "PAUSED" | "CANCELLED";
export type Category = "WORK" | "PERSONAL" | "STUDY" | "BREAK";




export interface TaskInput {
    content: string;
    plannedStart: Date;
    plannedEnd: Date;
    category: Category;
}


export interface TaskDomain extends TaskInput {
    routineId: string;
    status: StatusTask;
    durationSec: number;
    totalSeconds: number;
    startedAt: Date | null;
    finishedAt: Date | null;
    cancelledAt: Date | null;
    actualDurationSec?: number;
}





export interface TaskModel {
    id: string;
    userId: string;
    content: string;
    routineId: string;
    category: Category;
    plannedStart: Date;
    plannedEnd: Date;
    durationSec: number;
    status: StatusTask;
    startedAt: Date | null;
    finishedAt: Date | null;
    cancelledAt: Date | null;
    totalSeconds: number;
    actualDurationSec: number;
    createdAt: Date;
    updatedAt: Date;
}





