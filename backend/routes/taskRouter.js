import express from 'express';
import {
    createTask,
    getAllTasks,
    updateTask,
    getTaskById,
    getTasksByWorkspace
} from '../controller/taskController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllTasks);
router.get('/:id', verifyToken, getTaskById);
router.get('/workspace/:workspaceId', verifyToken, getTasksByWorkspace);
router.post('/', verifyToken, createTask)
router.put('/:id', verifyToken, updateTask);

export default router;