import express from 'express';
import { getAllUsers, toggleUserStatus } from '../controller/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

// Only Admin (or roles with MANAGE_USERS or ALL) can access
router.use(verifyToken, checkPermission(['MANAGE_USERS', 'ALL']));

router.get('/', getAllUsers);
router.put('/:id/status', toggleUserStatus);

export default router;
