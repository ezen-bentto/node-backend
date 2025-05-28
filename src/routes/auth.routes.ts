import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();
const authController = new AuthController();

authRouter.get('/kakao/callback', authController.kakaoCallback);
authRouter.get('/kakao/login', authController.getKakaoLoginUrl);
