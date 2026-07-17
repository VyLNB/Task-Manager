import express from 'express';
import { approveRequest, rejectRequest } from '../controller/taskChangeController.js';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/:requestId/approve', verifyToken, checkRole(['Project Manager', 'Admin']), approveRequest);
router.put('/:requestId/reject', verifyToken, checkRole(['Project Manager', 'Admin']), rejectRequest);

export default router;
