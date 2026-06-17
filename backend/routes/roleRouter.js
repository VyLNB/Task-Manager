import express from 'express';
import {
    getAllRoles,
    createRole,
    updateRole,
    assignRoleToUser
} from '../controller/roleController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkPermission } from '../middlewares/checkPermission.js';

const router = express.Router();

// Only Admin (or someone with MANAGE_ROLES) can access these routes
router.use(verifyToken, checkPermission(['MANAGE_ROLES', 'ALL']));

router.get('/', getAllRoles);
router.post('/', createRole);
router.put('/:id', updateRole);
router.post('/assign', assignRoleToUser);

export default router;
