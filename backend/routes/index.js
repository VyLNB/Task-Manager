import express from 'express';
import authRouter from './authRouter.js';
import taskRouter from './taskRouter.js';
import workspaceRouter from './workspaceRouter.js';
import roleRouter from './roleRouter.js';
import userRouter from './userRouter.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/tasks', taskRouter);
router.use('/workspaces', workspaceRouter);
router.use('/roles', roleRouter);
router.use('/users', userRouter);

export default router;