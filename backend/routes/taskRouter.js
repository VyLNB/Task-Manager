import express from 'express';
import {
    createTask,
    getAllTasks,
    updateTask,
    getTaskById,
    getTasksByWorkspace,
    pauseTask,
    cancelTask
} from '../controller/taskController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkMember } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.use(verifyToken, checkMember);

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.get('/workspace/:workspaceId', getTasksByWorkspace);
router.post('/', createTask)
router.put('/:id', updateTask);
router.put('/:id/pause', pauseTask);
router.put('/:id/cancel', cancelTask);

export default router;