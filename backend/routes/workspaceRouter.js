import express from 'express';
import { createWorkspace, getWorkspace, inviteMember } from '../controller/workspaceController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createWorkspace);
router.get('/', getWorkspace);
router.post('/:workspaceId/invite', inviteMember);

export default router;
