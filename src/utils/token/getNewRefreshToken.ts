// src/utils/token/getNewRefreshToken.ts
import { ENV } from '../../config/env.config';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { AuthUser } from '../../types/auth.type';

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  loginId: string;
  provider: 'kakao' | 'naver' | 'google' | 'email';
  type: 'refresh';
}

// login_type (DB 숫자)을 provider (문자열)로 매핑하는 함수 (AccessToken과 동일하게 사용)
const mapLoginTypeToProviderForRefresh = (loginType: string | number | undefined): RefreshTokenPayload['provider'] | undefined => {
    if (loginType === undefined) return undefined;
    
    const type = String(loginType);
    switch (type) {
        case '1': return 'kakao';
        case '2': return 'naver';
        case '3': return 'google';
        case '4': return 'email';
        default: return undefined;
    }
};

export const getNewRefreshToken = (user: AuthUser): string => {
  const payload: RefreshTokenPayload = {
    userId: String(user.id),
    loginId: user.loginId,
    provider: mapLoginTypeToProviderForRefresh(user.provider) as RefreshTokenPayload['provider'], // 매핑 함수 사용
    type: 'refresh',
  };

  if (typeof ENV.jwt.refreshSecret !== 'string' || ENV.jwt.refreshSecret.length === 0) {
    throw new Error('REFRESH_SECRET 환경 변수가 유효하게 설정되지 않았습니다.');
  }

  const options: SignOptions = {
    expiresIn: ENV.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };

  const refreshToken = jwt.sign(payload, ENV.jwt.refreshSecret as Secret, options);
  return refreshToken;
};