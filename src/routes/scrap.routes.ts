import ScrapController from '@/controllers/scrap.controller'; '@/controllers/scrap.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

// 인증이 필요한 API
router.post('/toggle', authMiddleware, ScrapController.toggleScrap);

export default router;
