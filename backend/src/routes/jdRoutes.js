import { Router } from 'express';
import * as jdController from '../controllers/jdController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.get('/jd', authMiddleware.isAuthenticated, jdController.index);
router.post('/jd', authMiddleware.isAuthenticated, jdController.store);

export default router;
