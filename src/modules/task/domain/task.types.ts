
export type StatusTask = "PENDING" | "INPROGRESS" | "DONE" | "PAUSED" | "CANCELLED";
export type Category = "WORK" | "PERSONAL" | "STUDY" | "BREAK";




export type TaskInput = {
    userId: string;
    content: string;
    plannedStart: Date;
    plannedEnd: Date;
    category: Category;
}


export type TaskDomain = TaskInput & {
    routineId: string;
    status: StatusTask;
    durationSec: number;
    totalSeconds: number;
    startedAt: Date | null;
    finishedAt: Date | null;
    cancelledAt: Date | null;
    actualDurationSec?: number;
}









