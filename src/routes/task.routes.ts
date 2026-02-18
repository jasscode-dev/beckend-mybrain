

import { taskController } from "src/composition/task.composition";
import { Router } from "express";



const router = Router();


router.post('/:id/start', taskController.start);
router.post('/:id/pause', taskController.pause);
router.post('/:id/done', taskController.done);

export default router
