import { routineController } from "src/composition/routine.composition";
import { Router } from "express";
import { validateSchema } from "src/middlewares/validate.shema.middleware";
import { RoutineSchema } from "src/validators/routine.schema";
import { TaskSchema } from "src/validators/task.schema";

const router = Router();

router.post('/:date/tasks',validateSchema(RoutineSchema,"params"), validateSchema(TaskSchema),routineController.create);
router.get('/:date', routineController.getByDate);
router.get('/', routineController.getAllRoutines);

export default router;
