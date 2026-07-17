import express from 'express';
import { getAdminDashboardStats, getPMDashboardStats } from '../controller/dashboardController.js';
import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Only allow Admins to access the admin dashboard stats
router.get('/admin', verifyToken, checkRole(['Admin']), getAdminDashboardStats);

// Allow PM to access PM dashboard stats
router.get('/pm', verifyToken, checkRole(['Project Manager', 'Admin']), getPMDashboardStats);

export default router;
