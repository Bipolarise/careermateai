import { Router } from 'express';
import * as ragController from '../controllers/ragController.js';

const router = Router();

router.post('/rag/ask', ragController.ask);

export default router;
