import { routineController } from "src/composition/routine.composition";
import { Router } from "express";
import { authMiddleware } from "src/middlewares/auth.middleware";
import { createLimiter } from "src/middlewares/rate-limit.middleware";

const router = Router();

router.use(authMiddleware);

router.post('/:date/tasks', createLimiter, routineController.create);
router.get('/:date', routineController.getByDate);
router.get('/', routineController.getAllRoutines);

export default router;
