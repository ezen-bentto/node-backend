// src/routes/mypage.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { MypageController } from '../controllers/mypage/mypage.controller';

export const mypageRouter = Router();
const mypageController = new MypageController();

// 모든 마이페이지 API는 로그인이 필요하므로 authMiddleware를 사용
mypageRouter.get('/profile', authMiddleware, mypageController.getProfile);
mypageRouter.get('/posts', authMiddleware, mypageController.getMyPosts);
mypageRouter.get('/bookmarked-contests', authMiddleware, mypageController.getBookmarkedContests);
mypageRouter.get('/bookmarked-communities', authMiddleware, mypageController.getBookmarkedCommunities);
mypageRouter.patch('/profile', authMiddleware, mypageController.updateProfile);