import { routineController } from "src/composition/routine.composition";
import { Router } from "express";

const router = Router();

router.get('/today', routineController.getToday);
router.get('/calendar', routineController.getCalendar);

export default router;
