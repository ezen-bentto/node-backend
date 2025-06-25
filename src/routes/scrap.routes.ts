import ScrapController from '@/controllers/scrap.controller'; '@/controllers/scrap.controller';
import { Router } from 'express';
import { optionalAuthMiddleware } from '@/middlewares/optionalAuth.middleware';

const router = Router();

// 인증이 필요한 API
router.post('/toggle', optionalAuthMiddleware, ScrapController.toggleScrap);

export default router;
