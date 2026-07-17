import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { 
    createSprint, 
    getSprintsByWorkspace, 
    updateSprint, 
    deleteSprint 
} from '../controller/sprintController.js';

const router = express.Router();

router.post('/', verifyToken, createSprint);
router.get('/workspace/:workspaceId', verifyToken, getSprintsByWorkspace);
router.put('/:id', verifyToken, updateSprint);
router.delete('/:id', verifyToken, deleteSprint);

export default router;
