// src/utils/token/getNewAccessToken.ts
import { ENV } from '../../config/env.config';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { AuthUser } from '../../types/auth.type';

interface AccessTokenPayload extends JwtPayload {
  userId: number;
  loginId: string;
  nickname: string;
  email?: string;
  profileImage?: string;
  provider: 'kakao' | 'naver' | 'google' | 'email';
  userType?: '개인' | '기업' | '관리자';
  type: 'access';
}

export const getNewAccessToken = (user: AuthUser): string => {
  const payload: AccessTokenPayload = {
    userId: user.id,
    loginId: user.loginId,
    nickname: user.nickname,
    email: user.email,
    profileImage: user.profileImage,
    provider: user.provider,
    userType: user.userType,
    type: 'access',
  };

  // ENV.jwt.secret이 유효한 string인지 런타임에 확인합니다.
  if (typeof ENV.jwt.secret !== 'string' || ENV.jwt.secret.length === 0) {
    throw new Error('JWT_SECRET 환경 변수가 유효하게 설정되지 않았습니다.');
  }

  // secret이 string임을 보장하므로 as Secret 단언이 안전합니다.
  const accessToken = jwt.sign(payload, ENV.jwt.secret as Secret, { expiresIn: ENV.jwt.expiresIn });

  return accessToken;
};