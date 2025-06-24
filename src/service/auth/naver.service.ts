import axios from 'axios';
import qs from 'qs';
import { naverConfig } from '../../config/naver.config';
import { NaverUserInfo, SocialUser, AuthUser } from '../../types/auth.type';
import { Token } from '../../utils/token';
import { AuthModel } from '../../models/auth/auth.model';

export class NaverAuthService {
  private authModel = new AuthModel();

  async getNaverAccessToken(code: string, state: string): Promise<string> {
    try {
      const response = await axios.post(
        naverConfig.tokenUrl,
        qs.stringify({
          grant_type: 'authorization_code',
          client_id: naverConfig.clientId,
          client_secret: naverConfig.clientSecret,
          code,
          state,
        })
      );
      return response.data.access_token;
    } catch (error: any) {
      console.error('네이버 토큰 요청 실패:', error.response?.data || error.message);
      throw new Error(`네이버 인증 실패: ${error.message}`);
    }
  }

  async getNaverUserInfo(accessToken: string): Promise<SocialUser> {
    try {
      const response = await axios.get<NaverUserInfo>(naverConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;
      if (data.resultcode !== '00') {
        throw new Error(`네이버 사용자 정보 조회 실패: ${data.message}`);
      }

      return {
        socialId: data.response.id,
        email: data.response.email ?? '',
        nickname: data.response.nickname ?? '네이버 사용자',
        profileImage: data.response.profile_image ?? '',
        provider: 'naver',
      };
    } catch (error) {
      console.error('네이버 사용자 정보 요청 실패:', error);
      throw new Error('사용자 정보 조회 실패');
    }
  }

  async generateTokens(user: AuthUser) {
    const accessToken = Token.getNewAccessToken(user);
    const refreshToken = Token.getNewRefreshToken(user);

    const refreshTokenPayload = Token.decodeToken(refreshToken);
    const expirationDate = refreshTokenPayload.exp
      ? new Date(refreshTokenPayload.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.authModel.saveRefreshToken(user.id, refreshToken, expirationDate);

    return { accessToken, refreshToken };
  }
}