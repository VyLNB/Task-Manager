import express from 'express';
import authRouter from './authRouter.js';
import taskRouter from './taskRouter.js';


const router = express.Router();

router.use('/auth', authRouter);
router.use('/tasks', taskRouter)

export default router;