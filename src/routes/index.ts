import { Router } from 'express';
import taskRouter from './task.routes'

import routineRouter from './routine.routes'


const router = Router();
router.use("/tasks", taskRouter);
/* router.use("/user", userRouter) */
router.use("/routines", routineRouter);

export default router
