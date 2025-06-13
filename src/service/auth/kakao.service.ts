// src/service/auth/kakao.service.ts
import axios from 'axios';
import { kakaoConfig } from '../../config/kakao.config';
// import { ENV } from '../../config/env.config'; // 사용되지 않으면 제거 가능
import { KakaoUserInfo, SocialUser, AuthUser } from '../../types/auth.type';
import qs from 'qs';
import { getNewAccessToken } from '../../utils/token/getNewAccessToken'; // 개별 토큰 생성 함수 임포트
import { getNewRefreshToken } from '../../utils/token/getNewRefreshToken'; // 개별 토큰 생성 함수 임포트
import { AuthModel } from '../../models/auth/auth.model';
import { decodeToken } from '../../utils/token/decodeToken';

export class KakaoAuthService {
  private authModel = new AuthModel();

  async getKakaoAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        kakaoConfig.tokenUrl,
        qs.stringify({
          grant_type: 'authorization_code',
          client_id: kakaoConfig.clientId,
          client_secret: kakaoConfig.clientSecret,
          redirect_uri: kakaoConfig.redirectUri,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data.access_token;
    } catch (error: any) {
      console.error('카카오 토큰 요청 실패:', error.response?.data || error.message);
      throw new Error(`카카오 인증 실패: ${error.message}`);
    }
  }

  async getKakaoUserInfo(accessToken: string): Promise<SocialUser> {
    try {
      const response = await axios.get<KakaoUserInfo>(kakaoConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;
      const kakaoAccount = data.kakao_account || {};
      const profile = kakaoAccount.profile || {};

      return {
        socialId: String(data.id),
        email: kakaoAccount.email ?? '',
        nickname: profile.nickname ?? '카카오 사용자',
        profileImage: profile.profile_image_url ?? '',
        provider: 'kakao',
      };
    } catch (error) {
      console.error('카카오 사용자 정보 요청 실패:', error);
      throw new Error('사용자 정보 조회 실패');
    }
  }

  // AuthUser 객체를 받도록 변경
  async generateTokens(user: AuthUser) {
    const accessToken = getNewAccessToken(user); // AuthUser 객체 전달
    const refreshToken = getNewRefreshToken(user); // AuthUser 객체 전달

    const refreshTokenPayload = decodeToken(refreshToken);
    const expirationDate = refreshTokenPayload.exp ? new Date(refreshTokenPayload.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.authModel.saveRefreshToken(user.id, refreshToken, expirationDate);

    return { accessToken, refreshToken };
  }
}