//src/routes/user.route.ts

import { Router } from 'express';
import { updateProfile } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware'; // 인증 미들웨어
import multer from 'multer';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB 사이즈 제한
});

// PUT /api/user/profile : 프로필 정보(텍스트) 업데이트
router.put('/profile', authMiddleware, updateProfile);

export default router;
