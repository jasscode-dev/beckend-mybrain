import { routineController } from "src/composition/routine.composition";
import { Router } from "express";

const router = Router();

router.post('/:date/tasks', routineController.addTask);
router.get('/:date', routineController.getByDate);
router.get('/', routineController.getAllRoutines);

export default router;
