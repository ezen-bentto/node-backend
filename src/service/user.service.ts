import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/utils/AppError';
import * as UserModel from '@/models/user.model';
import { Token } from '@/utils/token';
import { AuthModel } from '@/models/auth/auth.model';
import { AuthUser, UpdateProfileData } from '@/types/auth.type';
import { 
    mapDbProviderToService, 
    mapDbUserTypeToService, 
    mapDbApprovalStatusToService 
} from '@/utils/mapper';

/**
 * 프로필 정보를 업데이트하는 서비스
 */
export const updateProfile = async (userId: number, data: UpdateProfileData) => {
  const currentUser = await UserModel.findById(userId);
  if (!currentUser) {
    throw new AppError(StatusCodes.NOT_FOUND, '사용자 정보를 찾을 수 없습니다.');
  }

  // 1. 이메일을 '실제로 변경'하려고 할 때만 중복 확인 수행
  if (data.email && data.email !== currentUser.email) {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
        throw new AppError(StatusCodes.CONFLICT, "이미 사용 중인 이메일입니다.");
    }
  }

  // 2. DB 업데이트
  await UserModel.updateProfile(userId, data);

  // 3. 변경된 최신 유저 정보 다시 조회
  const updatedUser = await UserModel.findById(userId);
  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "사용자 정보를 찾을 수 없습니다.");
  }

  // 4. JWT 페이로드 생성 (실제 DB 스키마에 맞게 수정)
  const tokenPayload: AuthUser = {
    id: String(updatedUser.user_id),
    loginId: updatedUser.login_id,
    email: updatedUser.email,
    nickname: updatedUser.nickname,
    profileImage: updatedUser.profile_image ?? undefined,
    provider: mapDbProviderToService(updatedUser.provider),  // login_type을 변환
    userType: mapDbUserTypeToService(updatedUser.user_type),     // user_type을 변환
  };

  // 5. 토큰 재발급
  const accessToken = Token.getNewAccessToken(tokenPayload);
  const refreshToken = Token.getNewRefreshToken(tokenPayload);

  // 6. 재발급된 Refresh Token을 DB에 저장
  const authModel = new AuthModel();
  const refreshTokenPayload = Token.decodeToken(refreshToken);
  const expirationDate = refreshTokenPayload.exp 
    ? new Date(refreshTokenPayload.exp * 1000) 
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  await authModel.saveRefreshToken(tokenPayload.id, refreshToken, expirationDate);

  return { accessToken, refreshToken };
};