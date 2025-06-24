import axios from 'axios';
import qs from 'qs';
import { googleConfig } from '../../config/google.config';
import { GoogleUserInfo, SocialUser, AuthUser } from '../../types/auth.type';
import { Token } from '../../utils/token';
import { AuthModel } from '../../models/auth/auth.model';

export class GoogleAuthService {
  private authModel = new AuthModel();

  async getGoogleAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        googleConfig.tokenUrl,
        qs.stringify({
          grant_type: 'authorization_code',
          client_id: googleConfig.clientId,
          client_secret: googleConfig.clientSecret,
          redirect_uri: googleConfig.redirectUri,
          code,
        })
      );
      return response.data.access_token;
    } catch (error: any) {
      console.error('구글 토큰 요청 실패:', error.response?.data || error.message);
      throw new Error(`구글 인증 실패: ${error.message}`);
    }
  }

  async getGoogleUserInfo(accessToken: string): Promise<SocialUser> {
    try {
      const response = await axios.get<GoogleUserInfo>(googleConfig.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = response.data;

      return {
        socialId: data.id,
        email: data.email ?? '',
        nickname: data.name ?? '구글 사용자',
        profileImage: data.picture ?? '',
        provider: 'google',
      };
    } catch (error) {
      console.error('구글 사용자 정보 요청 실패:', error);
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