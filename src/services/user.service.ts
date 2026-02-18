import { userDomain } from "src/domain/user";
import { IUserRepository } from "src/reposirories/user.repository";
import { TaskModel } from "src/types/task.type";






export const UserService = (userRepository: IUserRepository) => {
    const findById = async (id: string) => {
        const user = await userRepository.findById(id);
        if (!user) throw new Error("User not found");
        if (id != user.id) throw new Error("unauthorized");
        return user
    }
    const processTaskReward = async (userId: string, taskData: TaskModel) => {
        const user = await findById(userId)
       

        const xpGained = userDomain.calculateTaskXP(taskData);
        console.log("xp ganho", xpGained)

        if (xpGained > 0) {

            const updatedUser = userDomain.addXp(user, xpGained);


            await userRepository.update(updatedUser, userId);

            return {
                xpGained,
                newLevel: updatedUser.level,
                leveledUp: updatedUser.level > user.level
            };
        }

        return { xpGained: 0, leveledUp: false };
    };



    return {
        
     findById,
     processTaskReward,
    }
};