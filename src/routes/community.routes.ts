import CommunityController from '@/controllers/community.controller';
import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

// 인증이 필요한 API
router.post('/register', authMiddleware, CommunityController.regCommunityPost);
router.post('/modify', authMiddleware, CommunityController.modCommunityPost);
router.post('/delete', authMiddleware, CommunityController.delCommunityPost);

// 인증 필요 없는 API (목록, 상세보기 등은 공개)
router.get('/getList', CommunityController.getCommunityList);
router.get('/getDetail', CommunityController.getCommunityDetail);

export default router;
