import express from 'express';
import { createWorkspace, getWorkspace, inviteMember, getAllWorkspacesAdmin, updateWorkspaceStatus } from '../controller/workspaceController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkMember, checkAdmin, checkProjectManager } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

router.get('/all', verifyToken, checkAdmin, getAllWorkspacesAdmin);

router.post('/', verifyToken, checkProjectManager, createWorkspace);
router.get('/', verifyToken, checkMember, getWorkspace);
router.post('/:workspaceId/invite', verifyToken, checkMember, inviteMember);
router.put('/:workspaceId/status', verifyToken, checkProjectManager, updateWorkspaceStatus);

export default router;
