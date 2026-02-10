

import { taskController } from "@/composition/task.composition";
import { Router } from "express";



const router = Router();

router.post('/', taskController.create);
router.get('/', taskController.findAll);
router.get('/:id', taskController.findById);
router.post('/:id/start', taskController.start);

export default router
