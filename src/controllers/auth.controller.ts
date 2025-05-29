import { Request, Response } from 'express';
import { KakaoAuthService } from '../service/auth/kakao.service';
import { AuthModel } from '../models/auth/auth.model';
import { AuthResponse } from '../types/auth.type';
import { ENV } from '../config/env.config';
import { kakaoConfig } from '../config/kakao.config';

export class AuthController {
  private kakaoAuthService = new KakaoAuthService();
  private authModel = new AuthModel();

  // 명시적으로 Promise<void> 반환 타입 지정
  kakaoCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(400).json({
          success: false,
          message: '인증 코드가 없습니다.',
        });
        return;
      }

      // 1. 카카오 액세스 토큰 획득
      const accessToken = await this.kakaoAuthService.getKakaoAccessToken(code);

      // 2. 카카오 사용자 정보 획득
      const socialUser = await this.kakaoAuthService.getKakaoUserInfo(accessToken);

      // 3. 기존 사용자 확인
      let user = await this.authModel.findUserBySocialId(
        socialUser.socialId,
        socialUser.provider
      );

      if (!user) {
        // 4. 새 사용자인 경우 등록
        const userId = await this.authModel.createSocialUser(socialUser);
        user = await this.authModel.findUserById(userId);
      } else {
        // 5. 기존 사용자인 경우 정보 업데이트
        await this.authModel.updateSocialUser(user.id, {
          nickname: socialUser.nickname,
          profileImage: socialUser.profileImage,
        });
        user = await this.authModel.findUserById(user.id);
      }

      // 6. JWT 토큰 생성
      const { accessToken: jwtAccessToken, refreshToken } = 
        this.kakaoAuthService.generateTokens(user.id);

      // 7. 프론트엔드로 리다이렉트 (토큰을 쿼리 파라미터로 전달)
      const redirectUrl = `${ENV.corsOrigin}/login/callback?token=${jwtAccessToken}&refresh=${refreshToken}`;
      res.redirect(redirectUrl);

    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      res.redirect(`${ENV.corsOrigin}/login?error=kakao_login_failed`);
    }
  };

  // 명시적으로 void 반환 타입 지정
  getKakaoLoginUrl = (req: Request, res: Response): void => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoConfig.clientId}&redirect_uri=${encodeURIComponent(kakaoConfig.redirectUri)}&response_type=code`;
    
    res.json({
      success: true,
      data: { loginUrl: kakaoAuthUrl },
      message: '카카오 로그인 URL 생성',
    });
  };
}