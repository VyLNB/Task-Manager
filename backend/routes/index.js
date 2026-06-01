import express from 'express';
import authRouter from './authRouter.js';
import taskRouter from './taskRouter.js';
import workspaceRouter from './workspaceRouter.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/tasks', taskRouter);
router.use('/workspaces', workspaceRouter);

export default router;