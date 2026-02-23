import { Router } from 'express';
import taskRouter from './task.routes'

import routineRouter from './routine.routes'
import userRouter from './user.routes'
import authRouter from'./auth.routes'


const router = Router();
router.use("/auth",authRouter)
router.use("/tasks", taskRouter);
router.use("/users", userRouter) 
router.use("/routines", routineRouter);

export default router
