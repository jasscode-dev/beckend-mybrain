import { Router } from "express";
import { userController } from "src/composition/user.composition";

const router = Router();

router.get('/me', userController.get);

export default router;
