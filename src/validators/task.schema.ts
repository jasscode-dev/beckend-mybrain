import { z } from "zod";



export const taskSchema = z.object({

    content: z.string().min(2, {
        message: "Content must have at least 2 characters"
    }),
    plannedStart: z.coerce.date({ message: "Invalid start date format" }),
    plannedEnd: z.coerce.date({ message: "Invalid end date format" }),
    category: z.enum(
        ["STUDY", "WORK", "PERSONAL", "BREAK"],
        {
            message: "Invalid category"
        }
    )


})
export const idTaskSchema = z.object({
    id: z.cuid({ message: "Invalid CUID format" })
});
export type askSchemaType = z.infer<typeof taskSchema>;
