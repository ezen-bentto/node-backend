import ContestController from '@/controllers/contest.controller';
import { Router } from 'express';

const router = Router();

router.get('/detail', ContestController.detail);
router.get('/list', ContestController.list);
router.post('/create', ContestController.create);
router.post('/update', ContestController.update);

export default router;
