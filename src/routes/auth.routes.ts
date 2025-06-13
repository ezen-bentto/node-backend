// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRouter = Router();
const authController = new AuthController();

// 소셜 로그인 관련
authRouter.get('/kakao/callback', authController.kakaoCallback);
authRouter.get('/kakao/login-url', authController.getKakaoLoginUrl); // URL을 가져오는 엔드포인트 이름 변경

// 기업 회원 관련
authRouter.post('/signup/company', authController.signUpCompany); // 기업 회원가입
authRouter.post('/login/company', authController.loginCompany); // 기업 회원 로그인

// 토큰 재발급 (로그인 미들웨어보다 먼저 처리)
authRouter.post('/token/refresh', authController.refreshToken);

// 로그인 미들웨어 적용 (이 이후의 라우트들은 req.user를 사용할 수 있습니다.)
// authRouter.use(authenticateUser); // 특정 라우트에만 적용하거나 전역 적용 가능

// 로그아웃 (토큰을 만료시켜야 하므로 토큰 정보가 필요할 수 있음)
authRouter.post('/logout', authController.logout);