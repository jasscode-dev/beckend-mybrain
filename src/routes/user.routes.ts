 import { Router } from "express";
import { userController } from "src/composition/user.composition";


const router = Router();

router.post('/register', userController.register);


export default router;
