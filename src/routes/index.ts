import { Router } from 'express';
import taskRouter from './task.routes'
import userRouter from './user.routes'
import routineRouter from './routine.routes'
import metricsRouter from './metrics.routes'

const router = Router();
router.use("/task", taskRouter)
router.use("/user", userRouter)
router.use("/routine", routineRouter)
router.use("/metrics", metricsRouter)
export default router
