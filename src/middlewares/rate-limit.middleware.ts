import rateLimit from 'express-rate-limit';

// Rate limiter geral para toda a API
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por IP
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter específico para autenticação (mais restritivo)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Apenas 5 tentativas de login
    message: 'Too many login attempts, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Não conta requests bem-sucedidos
});

// Rate limiter para criação de recursos (tasks, routines)
export const createLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 20, // 20 criações por minuto
    message: 'Too many creation requests, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
});
