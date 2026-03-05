import { normalizeDate } from "src/utils/date";
import z from "zod";

export const routineSchema = z.object({
    date: z.coerce.date({ message: "Invalid date format" })
        .transform((date) => {
            console.log("normalizee",normalizeDate(date))
            return normalizeDate(date)
            
        })
})


export type RoutineParams = z.infer<typeof routineSchema>;