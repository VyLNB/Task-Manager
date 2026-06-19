import express from 'express';
import {
    createTask,
    getAllTasks,
    updateTask,
    getTaskById,
    getTasksByWorkspace
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

export default router;