import CommentController from '@/controllers/comment.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();

// 인증이 필요한 API
router.post('/register', authMiddleware, CommentController.regComment);
router.post('/modify', authMiddleware, CommentController.modComment);
router.post('/delete', authMiddleware, CommentController.delComment);

// 인증 필요 없는 API (목록, 상세보기 등은 공개)
router.get('/getList', CommentController.getComment);

export default router;