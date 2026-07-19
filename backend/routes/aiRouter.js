import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { evaluateWorkspace, getEvaluationHistory, getMyEvaluations } from '../controller/aiController.js';

const router = express.Router();

router.post('/evaluate/workspace/:workspaceId', verifyToken, evaluateWorkspace);
router.get('/evaluations/workspace/:workspaceId', verifyToken, getEvaluationHistory);
router.get('/evaluations/me', verifyToken, getMyEvaluations);

export default router;
