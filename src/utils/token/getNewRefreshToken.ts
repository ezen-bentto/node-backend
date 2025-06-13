// src/utils/token/getNewRefreshToken.ts
import { ENV } from '../../config/env.config';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
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

  if (typeof ENV.jwt.refreshSecret !== 'string' || ENV.jwt.refreshSecret.length === 0) {
    throw new Error('REFRESH_SECRET 환경 변수가 유효하게 설정되지 않았습니다.');
  }

  const options: SignOptions = {
    expiresIn: ENV.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };

  const refreshToken = jwt.sign(payload, ENV.jwt.refreshSecret as Secret, options);
  return refreshToken;
};
