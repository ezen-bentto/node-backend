import ContestController from '@/controllers/contest.controller';
import { Router } from 'express';

const router = Router();

router.get('/detail', ContestController.detail);

export default router;
