import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { kakaoConfig } from '../../config/kakao.config';
import { ENV } from '../../config/env.config';
import { KakaoUserInfo, SocialUser, AuthResponse } from '../../types/auth.type';

export class KakaoAuthService {
  // 카카오 액세스 토큰 획득
  async getKakaoAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        kakaoConfig.tokenUrl,
        {
          grant_type: 'authorization_code',
          client_id: kakaoConfig.clientId,
          client_secret: kakaoConfig.clientSecret,
          redirect_uri: kakaoConfig.redirectUri,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('카카오 토큰 요청 실패:', error);
      throw new Error('카카오 인증 실패');
    }
  }

  // 카카오 사용자 정보 획득
  async getKakaoUserInfo(accessToken: string): Promise<SocialUser> {
    try {
      const response = await axios.get<KakaoUserInfo>(kakaoConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { id, kakao_account } = response.data;
      
      return {
        socialId: String(id),
        email: kakao_account.email || '',
        nickname: kakao_account.profile?.nickname || '',
        profileImage: kakao_account.profile?.profile_image_url,
        provider: 'kakao',
      };
    } catch (error) {
      console.error('카카오 사용자 정보 요청 실패:', error);
      throw new Error('사용자 정보 조회 실패');
    }
  }

  // JWT 토큰 생성
  generateTokens(userId: number) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      ENV.jwt.secret,
      { expiresIn: ENV.jwt.expiresIn } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      ENV.jwt.refreshSecret,
      { expiresIn: ENV.jwt.refreshExpiresIn } as jwt.SignOptions
    );

    return { accessToken, refreshToken };
  }
}