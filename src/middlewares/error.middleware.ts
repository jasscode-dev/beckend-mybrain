import { NextFunction, Request, Response } from "express";
import { AppError } from "src/errors/appError";
import { ZodError } from "zod";


export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof AppError) {
        console.log(`[AppErrorHandler] Caught AppError: ${error.message} - Status: ${error.statusCode} - Request: ${req.method} ${req.originalUrl}`);
        return res.status(error.statusCode).json({
            error: error.message,
            data: null
        });
    }
    if (error instanceof ZodError) {
        console.log(error.issues)
        const errorMessage = error.issues.map(err => err.message).join(', ')
        res.status(400).json({
            error: errorMessage,
            data: null
        });
        return;
    }

    console.error("Internal Server Error Details:", error);

    res.status(500).json({ error: "Erro interno do servidor", data: null })
    return;
}