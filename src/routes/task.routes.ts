import { taskController } from "src/composition/task.composition";
import { Router } from "express";
import { authMiddleware } from "src/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post('/:id/start', taskController.start);
router.post('/:id/pause', taskController.pause);
router.post('/:id/done', taskController.done);
router.delete('/:id', taskController.delete);

export default router;
