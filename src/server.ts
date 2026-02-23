import express from 'express'
import cors from 'cors'

import router from './routes'
import { globalErrorHandler } from './middlewares/error.middleware'
import { generalLimiter } from './middlewares/rate-limit.middleware'

export const server = express()

server.use(cors())
server.use(express.json({ limit: '10mb' })) // Limite de payload
server.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting geral
server.use('/api', generalLimiter);

server.use('/api', router)
server.use(globalErrorHandler);

const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`Running: http://localhost:${PORT}`)
    })
}
