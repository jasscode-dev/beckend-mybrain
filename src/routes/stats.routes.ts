import { statsController } from "src/composition/stats.composition";
import { Router } from "express";


const router = Router();

router.get('/highlights', statsController.getHighlights);

export default router;
