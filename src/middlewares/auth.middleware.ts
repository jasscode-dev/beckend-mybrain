import { Request, Response, NextFunction } from 'express';
import { verifyToken } from 'src/lib/jwt';
import { AppError } from 'src/errors/appError';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = async(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return next(new AppError('Token not provided', 401));
        

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            (new AppError('Invalid token format', 401));
        }

        const decoded = verifyToken(token);
        req.userId = decoded.userId;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
