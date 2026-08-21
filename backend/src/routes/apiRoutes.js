import { Router } from 'express';
import * as resumeController from '../controllers/resumeController.js';

const router = Router();

router.get('/resume', resumeController.index);
router.get('/resume/:id', resumeController.show);
router.post('/resume', resumeController.store);
router.put('/resume/:id', resumeController.update);
router.delete('/resume/:id', resumeController.destroy);

export default router;
