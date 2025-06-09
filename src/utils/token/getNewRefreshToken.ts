// src/utils/token/getNewRefreshToken.ts
import { ENV } from '../../config/env.config';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { AuthUser } from '../../types/auth.type';

interface RefreshTokenPayload extends JwtPayload {
  userId: number;
  loginId: string;
  provider: 'kakao' | 'naver' | 'google' | 'email';
  type: 'refresh';
}

export const getNewRefreshToken = (user: AuthUser): string => {
  const payload: RefreshTokenPayload = {
    userId: user.id,
    loginId: user.loginId,
    provider: user.provider,
    type: 'refresh',
  };

  // ENV.jwt.refreshSecret이 유효한 string인지 런타임에 확인합니다.
  if (typeof ENV.jwt.refreshSecret !== 'string' || ENV.jwt.refreshSecret.length === 0) {
    throw new Error('REFRESH_SECRET 환경 변수가 유효하게 설정되지 않았습니다.');
  }

  // secret이 string임을 보장하므로 as Secret 단언이 안전합니다.
  const refreshToken = jwt.sign(payload, ENV.jwt.refreshSecret as Secret, {
    expiresIn: ENV.jwt.refreshExpiresIn,
  });
  return refreshToken;
};