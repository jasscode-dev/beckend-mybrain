import { Router } from "express";
import { authController } from "src/composition/auth.composition";
import { authLimiter } from "src/middlewares/rate-limit.middleware";

const router = Router();


router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);

export default router;
