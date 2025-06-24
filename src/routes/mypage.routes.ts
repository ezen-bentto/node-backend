// src/routes/mypage.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { MypageController } from '../controllers/mypage/mypage.controller';

export const mypageRouter = Router();
const mypageController = new MypageController();

// 내 프로필 정보 조회
mypageRouter.get('/profile', authMiddleware, mypageController.getProfile);
// 내가 쓴 글 목록 조회
mypageRouter.get('/posts', authMiddleware, mypageController.getMyPosts);
// 프로필 수정
mypageRouter.patch('/profile', authMiddleware, mypageController.updateProfile);