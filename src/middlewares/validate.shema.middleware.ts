import { RequestHandler } from "express";
import { ZodSchema } from "zod";

type RequestSegment = 'body' | 'params' | 'query';

export const validateSchema = (schema: ZodSchema, segment: RequestSegment = 'body'): RequestHandler => {
    return (req, res, next) => {
        const validatedData = schema.parse(req[segment]);
        req[segment] = validatedData;
        next();
    };
};
