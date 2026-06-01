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

router.get('/getAll', verifyToken, getAllTasks);
router.get('/:id', verifyToken, getTaskById);
router.get('/workspace/:workspaceId', verifyToken, getTasksByWorkspace);
router.post('/createNew', verifyToken, createTask)
router.put('/:id', verifyToken, updateTask);

export default router;