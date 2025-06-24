// src/utils/token.ts

import { getNewAccessToken } from './token/getNewAccessToken';
import { getNewRefreshToken } from './token/getNewRefreshToken';
import { verifyAccessToken } from './token/verifyAccessToken';
import { verifyRefreshToken } from './token/verifyRefreshToken';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser, User } from '../types/auth.type'; // User 타입 임포트
import { decodeToken } from './token/decodeToken';
import type { AccessTokenPayload } from './token/verifyAccessToken';
import type { RefreshTokenPayload } from './token/verifyRefreshToken';
import { mapDbProviderToService, mapDbUserTypeToService, mapDbApprovalStatusToService } from './mapper'; // 매핑 함수 임포트

export const Token = {
  getNewAccessToken,
  getNewRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,

  async refreshTokens(
    refreshToken: string
  ): Promise<{ ok: boolean; accessToken?: string; refreshToken?: string; user?: AuthUser; message?: string }> {
    const authModel = new AuthModel();

    const { ok, payload, message } = verifyRefreshToken(refreshToken);

    // payload.userId는 string, payload.loginId도 string
    if (!ok || !payload || !payload.userId || typeof payload.userId !== 'string' || !payload.loginId) {
      return { ok: false, message: message || 'Refresh Token 검증 실패: 유효한 사용자 정보 부족' };
    }

    // payload.userId는 string이므로, DB 조회 시에는 Number()로 변환
    const storedToken = await authModel.findRefreshTokenByToken(refreshToken);
    if (!storedToken || String(storedToken.user_id) !== payload.userId) { // storedToken.user_id도 string으로 변환하여 비교
        await authModel.deleteRefreshToken(refreshToken);
        return { ok: false, message: '유효하지 않은 Refresh Token입니다. 다시 로그인 해주세요.' };
    }

    if (storedToken.exp_date && new Date(storedToken.exp_date).getTime() < Date.now()) {
        await authModel.deleteRefreshToken(refreshToken);
        return { ok: false, message: 'Refresh Token이 만료되었습니다. 다시 로그인 해주세요.' };
    }

    await authModel.deleteRefreshToken(refreshToken); // 1회용 Refresh Token 전략

    // payload.userId는 string이므로, DB 조회 시에는 Number()로 변환
    const user: User | undefined = await authModel.findUserById(Number(payload.userId));
    if (!user) {
      return { ok: false, message: '사용자 정보를 찾을 수 없습니다.' };
    }

    // DB에서 조회한 user 정보를 기반으로 AuthUser 객체 생성
    const authUser: AuthUser = {
      id: String(user.user_id), // BigInt/Number를 String으로 변환
      loginId: user.login_id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profile_image,
      // 매핑 함수를 사용하여 DB의 코드 값을 서비스용 문자열로 변환
      provider: mapDbProviderToService(user.provider) || 'email', // 기본값 지정
      userType: mapDbUserTypeToService(user.user_type) || '개인', // 기본값 지정
      approvalStatus: mapDbApprovalStatusToService(user.approval_status),
    };

    // 새로운 토큰 발급 시 authUser 객체 전달
    const newAccessToken = getNewAccessToken(authUser);
    const newRefreshToken = getNewRefreshToken(authUser);

    const refreshTokenPayload = decodeToken(newRefreshToken);
    const expirationDate = refreshTokenPayload.exp ? new Date(refreshTokenPayload.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // user.id는 AuthUser의 id로 String 타입이어야 함
    await authModel.saveRefreshToken(authUser.id, newRefreshToken, expirationDate);

    return { ok: true, accessToken: newAccessToken, refreshToken: newRefreshToken, user: authUser };
  },
};