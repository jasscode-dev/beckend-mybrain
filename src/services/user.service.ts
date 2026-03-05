import { User } from "src/domain/user";
import { AppError } from "src/errors/appError";
import { RoutineStatus } from "src/generated/prisma";
import { IUserRepository } from "src/reposirories/user.repository";
import { TaskModel } from "src/types/task.type";
import { LoginUserInput, UserInput } from "src/types/user.type";
import bcrypt from "bcryptjs";
import crypto from "crypto";






export const UserService = (userRepository: IUserRepository) => {
    const findById = async (id: string) => {
        const user = await userRepository.findById(id);
        if (!user) throw new AppError("User not found",404);
     
        return user
    }
    const processTaskReward = async (userId: string, taskData: TaskModel) => {
        const user = await findById(userId)


        const xpResult = User.calculateTaskXP(taskData);


        if (xpResult.xp > 0) {

            const updatedUser = User.addXp(user, xpResult.xp);


            await userRepository.update(updatedUser, userId);

            return {
                xpGained: xpResult.xp,
                reason: xpResult.reason,
                newLevel: updatedUser.level,
                leveledUp: updatedUser.level > user.level
            };
        }

        return { 
            xpGained: 0, 
            reason: xpResult.reason,
            leveledUp: false 
        };
    };
    const addStar = async (status: RoutineStatus, userId: string) => {


        const user = await findById(userId)
        const updatedUser = User.addStar(status, user)
        const earned = updatedUser.stars > user.stars
        if (earned) {
            //TODO: addStar no dailyAchievment

            userRepository.update(updatedUser, userId)
            return true


        }
        return false


    }
    
    const removeStar = async (userId: string) => {
        const user = await findById(userId)
        const updatedUser = User.removeStar(user)
        const removed = updatedUser.stars < user.stars
        
        if (removed) {
            await userRepository.update(updatedUser, userId)
            return true
        }
        return false
    }


    const register = async (userIput: UserInput) => {

        const userExists = await userRepository.findByEmail(userIput.email)

        if (userExists) {
            throw new AppError("User already exists")
        }

        const hashPassword = await bcrypt.hash(userIput.password, 10)

        const userDomain = User.create({
            ...userIput,
            password: hashPassword
        }


        )
        return await userRepository.save(userDomain)
    }
    const login = async (loginUserInput: LoginUserInput) => {
        const user = await userRepository.findByEmail(loginUserInput.email);
        if (!user) {
            throw new AppError("Invalid credentials", 401);
        }

        const validPassword = await bcrypt.compare(loginUserInput.password, user.password);

        if (!validPassword) {
            throw new AppError("Invalid credentials", 401);
        }

        const token = crypto.randomBytes(32).toString("hex");
        await userRepository.saveToken(user.id, token);
        return {
            user,
            token
        };

    };
    const logout = async (token: string) => {
        const user = await userRepository.findByToken(token);
        if (user) {
            await userRepository.deleteToken(user.id);
        }
    }
    const validateToken = async (token: string) => {
        const user = await userRepository.findByToken(token);

        if(!user) {
            return null;

        }
        return user;
    }


    return {
        findById,
        processTaskReward,
        addStar,
        removeStar,
        register,
        login,
        logout,
        validateToken
    }
};