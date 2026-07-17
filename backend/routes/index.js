import express from 'express';
import authRouter from './authRouter.js';
import taskRouter from './taskRouter.js';
import workspaceRouter from './workspaceRouter.js';
import roleRouter from './roleRouter.js';
import userRouter from './userRouter.js';
import timesheetRouter from './timesheetRouter.js';
import sprintRouter from './sprintRouter.js';
import dashboardRouter from './dashboardRouter.js';
import taskChangeRouter from './taskChangeRouter.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/tasks', taskRouter);
router.use('/workspaces', workspaceRouter);
router.use('/roles', roleRouter);
router.use('/users', userRouter);
router.use('/timesheets', timesheetRouter);
router.use('/sprints', sprintRouter);
router.use('/dashboard', dashboardRouter);
router.use('/task-change-requests', taskChangeRouter);

export default router;