import express from 'express';
import { 
    createTimesheet, 
    getMyTimesheets, 
    updateTimesheet, 
    deleteTimesheet,
    getWorkspaceTimesheets,
    updateTimesheetStatus,
    getAllTimesheets
} from '../controller/timesheetController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkMember, checkProjectManager } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

// Member Routes
router.post('/', verifyToken, createTimesheet);
router.get('/me', verifyToken, getMyTimesheets);
router.put('/:id', verifyToken, updateTimesheet);
router.delete('/:id', verifyToken, deleteTimesheet);

// PM and Admin Routes
// don't use checkMember because the controller will verify if the user is the leader or an Admin
router.get('/workspace/:workspaceId', verifyToken, getWorkspaceTimesheets);
router.patch('/:id/status', verifyToken, updateTimesheetStatus); // PM checking is done in controller

// Admin
router.get('/all', verifyToken, getAllTimesheets);

export default router;
