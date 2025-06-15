// src/utils/token.ts (메인 엔트리 포인트)
import { getNewAccessToken } from './token/getNewAccessToken';
import { getNewRefreshToken } from './token/getNewRefreshToken';
import { validTokenCheck } from './token/validTokenCheck'; // 현재 직접 사용되지 않음
import { verifyAccessToken } from './token/verifyAccessToken';
import { verifyRefreshToken } from './token/verifyRefreshToken';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser } from '../types/auth.type';
import { decodeToken } from './token/decodeToken';

export const Token = {
  getNewAccessToken,
  getNewRefreshToken,
  validTokenCheck, // 현재 직접 사용되지 않음. 제거 고려 가능
  verifyAccessToken,
  verifyRefreshToken,

  async refreshTokens(
    refreshToken: string
  ): Promise<{ ok: boolean; accessToken?: string; refreshToken?: string; user?: AuthUser; message?: string }> {
    const authModel = new AuthModel();

    const { ok, payload, message } = verifyRefreshToken(refreshToken);

    if (!ok || !payload || !payload.userId || !payload.loginId) { // loginId 필수 체크 추가
      return { ok: false, message: message || 'Refresh Token 검증 실패: 유효한 사용자 정보 부족' };
    }

    const storedToken = await authModel.findRefreshTokenByToken(refreshToken);
    if (!storedToken || storedToken.user_id !== payload.userId) {
        await authModel.deleteRefreshToken(refreshToken);
        return { ok: false, message: '유효하지 않은 Refresh Token입니다. 다시 로그인 해주세요.' };
    }

    if (storedToken.exp_date && new Date(storedToken.exp_date).getTime() < Date.now()) {
        await authModel.deleteRefreshToken(refreshToken);
        return { ok: false, message: 'Refresh Token이 만료되었습니다. 다시 로그인 해주세요.' };
    }

    await authModel.deleteRefreshToken(refreshToken); // 1회용 Refresh Token 전략

    const user = await authModel.findUserById(payload.userId);
    if (!user) {
      return { ok: false, message: '사용자 정보를 찾을 수 없습니다.' };
    }

    // DB에서 조회한 user 정보를 기반으로 AuthUser 객체 생성 (loginId 포함)
    const authUser: AuthUser = {
      id: user.user_id,
      loginId: user.login_id, // login_id 추가
      email: user.email || user.login_id,
      nickname: user.nickname,
      profileImage: user.profile_image,
      provider: user.user_type === '개인' ? 'kakao' : (user.user_type === '기업' ? 'email' : 'email'), // user_type에 따라 provider 설정
      userType: user.user_type, // user_type 정보 추가
      approvalStatus: user.approval_status // approval_status 정보 추가
    };

    // 새로운 토큰 발급 시 authUser 객체 전달
    const newAccessToken = getNewAccessToken(authUser);
    const newRefreshToken = getNewRefreshToken(authUser);

    const refreshTokenPayload = decodeToken(newRefreshToken);
    const expirationDate = refreshTokenPayload.exp ? new Date(refreshTokenPayload.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authModel.saveRefreshToken(authUser.id, newRefreshToken, expirationDate); // authUser.id 사용

    return { ok: true, accessToken: newAccessToken, refreshToken: newRefreshToken, user: authUser };
  },
};