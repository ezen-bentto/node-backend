// src/utils/token/verifyRefreshToken.ts
import { ENV } from '../../config/env.config'; // 경로 수정
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'; // Secret 임포트 추가

// CustomJwtPayload 타입을 재사용하거나 RefreshTokenPayload 정의
export interface RefreshTokenPayload extends JwtPayload {
  userId: number;
  loginId: string; // 추가
  provider?: 'kakao' | 'naver' | 'google' | 'email';
  type?: 'access' | 'refresh';
}

export const verifyRefreshToken = (
  token: string
): { ok: boolean; payload?: RefreshTokenPayload; message?: string } => {
  try {
    // ENV.jwt.refreshSecret이 항상 string임을 확신할 수 있다면, Secret 타입 단언 사용
    const payload = jwt.verify(token, ENV.jwt.refreshSecret as Secret) as RefreshTokenPayload;
    if (payload.type !== 'refresh') {
      return { ok: false, message: '유효하지 않은 Refresh Token 타입입니다.' };
    }
    return { ok: true, payload };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { ok: false, message: 'Refresh Token이 만료되었습니다.' };
    }
    return { ok: false, message: '유효하지 않은 Refresh Token입니다.' };
  }
};
