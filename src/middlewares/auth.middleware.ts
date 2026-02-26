import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from 'src/errors/appError';
import { UserService } from 'src/services/user.service';
import { UserRepository } from 'src/reposirories/user.repository';

export const authMiddleware:RequestHandler= async (req,res,next,) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return next(new AppError('Token not provided', 401));


        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return next(
                new AppError('Invalid token format', 401)
            );
        }

        const userService =UserService(UserRepository());
        const user = await userService.validateToken(token);
        if(!user) return next(new AppError('Invalid or expired token', 401));

        req.user = user;
                
        

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
