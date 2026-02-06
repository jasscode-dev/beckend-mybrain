import { Category, StatusTask } from "@modules/task/domain"

export const XP_CONFIG = {
    baseTask : 10,
    onTimeBonus :3,
    categoryBonus:{
        WORK :1,
        STUDY:2,
        BREAK:0,
        PERSONAL:0,

    },
    xpPerLevel:200

}
export  interface TaskXpInput {
    status:StatusTask;
    category:Category;
    plannedEnd:Date;
    finishedAt:Date | null;
}

