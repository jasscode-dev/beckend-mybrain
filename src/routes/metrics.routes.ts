import { metricsController } from "src/composition/metrics.composition";
import { Router } from "express";

const router = Router();

router.get('/highlights', metricsController.getHighlights);

export default router;
