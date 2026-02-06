import { IRoutineRepository } from "@modules/routine/repositories";
import { createRoutine } from "@modules/routine/domain";


export const RoutineService = (
    repository: IRoutineRepository,
) => {
    return {
        create: async (userId: string, date: Date) => {
            const existingRoutine = await repository.findByUserAndDay(userId, date);
            if (existingRoutine) {
                return existingRoutine
            }
            return await repository.save(createRoutine(userId, date));
        },
        findAllByUser: async (userId: string) => {
            return await repository.findAllByUser(userId)
        },
        findById: async (id: string) => {
            const routine = await repository.findById(id)
            if (!routine) throw new Error("Routine not found")
            return routine
        }
    }




}