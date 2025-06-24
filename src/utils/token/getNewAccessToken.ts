// src/utils/token/getNewAccessToken.ts
import { ENV } from '../../config/env.config';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { AuthUser } from '../../types/auth.type';

interface AccessTokenPayload extends JwtPayload {
  userId: string;
  loginId: string;
  nickname: string;
  email?: string;
  profileImage?: string;
  provider: 'kakao' | 'naver' | 'google' | 'email';
  userType?: '개인' | '기업' | '관리자';
  type: 'access';
}

// login_type (DB 숫자)을 provider (문자열)로 매핑하는 함수
const mapLoginTypeToProvider = (loginType: string | number | undefined): AccessTokenPayload['provider'] | undefined => {
  if (loginType === undefined) return undefined;
  
  const type = String(loginType); // 숫자를 문자열로 변환
  switch (type) {
    case '1': return 'kakao';
    case '2': return 'naver';
    case '3': return 'google';
    case '4': return 'email'; // 기업회원은 이메일로 매핑
    default: return undefined; // 또는 에러 처리
  }
};

export const getNewAccessToken = (user: AuthUser): string => {
  const payload: AccessTokenPayload = {
    userId: String(user.id), // user.id를 string으로 변환
    loginId: user.loginId,
    nickname: user.nickname,
    email: user.email,
    profileImage: user.profileImage,
    provider: mapLoginTypeToProvider(user.provider) as AccessTokenPayload['provider'], // 매핑 함수 사용
    userType: user.userType as AccessTokenPayload['userType'], // 필요시 타입 단언 또는 매핑 로직 추가
    type: 'access',
  };

  if (typeof ENV.jwt.secret !== 'string' || ENV.jwt.secret.length === 0) {
    throw new Error('JWT_SECRET 환경 변수가 유효하게 설정되지 않았습니다.');
  }

  const options: SignOptions = {
    expiresIn: ENV.jwt.expiresIn as SignOptions['expiresIn'],
  };

  const accessToken = jwt.sign(payload, ENV.jwt.secret as Secret, options);

  return accessToken;
};