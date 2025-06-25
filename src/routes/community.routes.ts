import CommunityController from '@/controllers/community.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { optionalAuthMiddleware } from '@/middlewares/optionalAuth.middleware';


const router = Router();

// 인증이 필요한 API
router.post('/register', authMiddleware, CommunityController.regCommunityPost);
router.post('/modify', authMiddleware, CommunityController.modCommunityPost);
router.post('/delete', authMiddleware, CommunityController.delCommunityPost);
router.get('/getDetail', optionalAuthMiddleware, CommunityController.getCommunityDetail);


// 인증 필요 없는 API (목록은 공개)
router.get('/getList', CommunityController.getCommunityList);

export default router;
