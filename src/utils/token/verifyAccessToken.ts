// src/utils/token/verifyAccessToken.ts
import { ENV } from '../../config/env.config'; // 경로 수정
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; // Secret 임포트 추가

// CustomJwtPayload 타입을 재사용하거나 AccessTokenPayload 정의
interface AccessTokenPayload extends JwtPayload {
  userId: number;
  loginId: string; // 추가
  nickname?: string;
  email?: string;
  profileImage?: string; // 추가
  provider?: 'kakao' | 'naver' | 'google' | 'email';
  userType?: '개인' | '기업' | '관리자'; // 추가
  type?: 'access' | 'refresh';
}

export const verifyAccessToken = (token: string): { ok: boolean; payload?: AccessTokenPayload; message?: string } => {
  try {
    // ENV.jwt.secret이 항상 string임을 확신할 수 있다면, Secret 타입 단언 사용
    const payload = jwt.verify(token, ENV.jwt.secret as Secret) as AccessTokenPayload;
    if (payload.type !== 'access') {
      return { ok: false, message: '유효하지 않은 Access Token 타입입니다.' };
    }
    return { ok: true, payload };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { ok: false, message: 'Access Token이 만료되었습니다.' };
    }
    return { ok: false, message: '유효하지 않은 Access Token입니다.' };
  }
};