// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { KakaoAuthService } from '../service/auth/kakao.service';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser, User } from '../types/auth.type'; // User 타입 임포트
import { ENV } from '../config/env.config';
import { kakaoConfig } from '../config/kakao.config';
import { Token } from '../utils/token';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { 
  mapDbProviderToService, 
  mapDbUserTypeToService, 
  mapDbApprovalStatusToService 
} from '../utils/mapper'; 


export class AuthController {
  private kakaoAuthService = new KakaoAuthService();
  private authModel = new AuthModel();

  // 카카오 콜백 처리 (개인 회원 소셜 로그인/회원가입)
  kakaoCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;

      if (!code || typeof code !== 'string') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '인증 코드가 없습니다.',
        });
        return;
      }

      const accessToken = await this.kakaoAuthService.getKakaoAccessToken(code);
      const socialUser = await this.kakaoAuthService.getKakaoUserInfo(accessToken);

      // user 변수의 타입을 User | undefined로 명시 (DB에서 온 값)
      let user: User | undefined = await this.authModel.findUserBySocialId(socialUser.socialId);

      let authUser: AuthUser;

      if (!user) {
        // 새 사용자인 경우 등록
        // createSocialUser는 number 또는 bigint를 반환하지만, findUserById는 number를 기대.
        // 현재 auth.model.ts에서 createSocialUser가 number를 반환한다고 가정.
        const newUserId = await this.authModel.createSocialUser(socialUser);
        user = await this.authModel.findUserById(Number(newUserId)); // findUserById는 number를 받도록 유지했으므로 Number() 변환
        if (!user) {
          throw new Error('새 사용자 정보를 불러오지 못했습니다.');
        }
        authUser = {
          id: user.user_id.toString(), // AuthUser.id는 string이므로 .toString()
          loginId: user.login_id,
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profile_image,
          provider: mapDbProviderToService(user.provider) || 'kakao', // 매핑 함수 사용
          userType: mapDbUserTypeToService(user.user_type) || '개인', // 매핑 함수 사용
          approvalStatus: mapDbApprovalStatusToService(user.approval_status), // 매핑 함수 사용
        };
      } else {
        // 기존 사용자인 경우 정보 업데이트
        // updateSocialUser는 number를 받도록 유지했으므로 Number() 변환
        await this.authModel.updateSocialUser(Number(user.user_id), { // user.user_id가 bigint일 수 있으므로 Number() 변환
          nickname: socialUser.nickname,
          profileImage: socialUser.profileImage,
        });
        user = await this.authModel.findUserById(Number(user.user_id)); // 업데이트된 정보 다시 조회, Number() 변환
        if (!user) {
          throw new Error('기존 사용자 정보를 불러오지 못했습니다.');
        }
        authUser = {
          id: user.user_id.toString(), // AuthUser.id는 string이므로 .toString()
          loginId: user.login_id,
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profile_image,
          provider: mapDbProviderToService(user.provider) || 'kakao', // 매핑 함수 사용
          userType: mapDbUserTypeToService(user.user_type) || '개인', // 매핑 함수 사용
          approvalStatus: mapDbApprovalStatusToService(user.approval_status), // 매핑 함수 사용
        };
      }

      // JWT 토큰 생성 (KakaoAuthService의 generateTokens 사용)
      const { accessToken: jwtAccessToken, refreshToken } =
        await this.kakaoAuthService.generateTokens(authUser);

      const redirectUrl = `${ENV.corsOrigin}/login/callback?token=${jwtAccessToken}&refresh=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      res.redirect(`${ENV.corsOrigin}/login?error=kakao_login_failed`);
    }
  };

  // 카카오 로그인 URL 반환 (변경 없음)
  getKakaoLoginUrl = (req: Request, res: Response): void => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoConfig.clientId}&redirect_uri=${encodeURIComponent(kakaoConfig.redirectUri)}&response_type=code`;

    res.status(StatusCodes.OK).json({
      success: true,
      data: { loginUrl: kakaoAuthUrl },
      message: '카카오 로그인 URL 생성',
    });
  };

  // 기업 회원 가입 (변경 없음, userId.toString() 이미 적용됨)
  signUpCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, companyName, phoneNumber } = req.body;

      if (!email || !password || !companyName || !phoneNumber) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '필수 입력값이 누락되었습니다.',
        });
        return;
      }

      const existingUser = await this.authModel.findUserByEmail(email);
      if (existingUser) {
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: '이미 등록된 이메일입니다.',
        });
        return;
      }

      const userId = await this.authModel.createCompanyUser({
        email,
        password,
        companyName,
        phoneNumber,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: '기업 회원가입이 완료되었습니다. 관리자 승인 대기 중입니다.',
        data: { userId: userId.toString() }, // userId가 number | bigint일 수 있으므로 .toString()
      });
    } catch (error) {
      console.error('기업 회원가입 실패:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '기업 회원가입 중 오류가 발생했습니다.',
      });
    }
  };

  // 기업 회원 로그인
  loginCompany = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '이메일과 비밀번호를 입력해주세요.',
        });
        return;
      }

      const user = await this.authModel.findUserByEmail(email);

      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
        return;
      }

      // 비밀번호 비교
      const isPasswordValid = await bcrypt.compare(password, user.password || '');
      if (!isPasswordValid) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        });
        return;
      }

      // 기업회원 승인 상태 확인 : 기업회원('2') 또는 관리자('3')인지 확인
      // user.user_type은 User 타입에 따라 '1' | '2' | '3' 이므로 직접 비교 가능
      if (user.user_type === '2') { // 기업회원일 경우
        if (user.approval_status !== '2') { // '2'는 승인 상태 (DB 기준)
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ message: '아직 관리자의 승인이 필요한 계정입니다.' });
          return;
        }
      } else if (user.user_type !== '3') { // 관리자도 아닐 경우
        res.status(StatusCodes.FORBIDDEN).json({ message: '로그인 권한이 없습니다.' });
        return;
      }

      // JWT 토큰 생성 (Token 유틸리티의 getNewAccessToken, getNewRefreshToken 사용)
      const authUser: AuthUser = {
        id: user.user_id.toString(), // AuthUser.id는 string이므로 .toString()
        loginId: user.login_id,
        email: user.email,
        nickname: user.nickname,
        profileImage: user.profile_image,
        provider: mapDbProviderToService(user.provider) || 'email', // 매핑 함수 사용
        userType: mapDbUserTypeToService(user.user_type), // 매핑 함수 사용
        approvalStatus: mapDbApprovalStatusToService(user.approval_status), // 매핑 함수 사용
      };

      const accessToken = Token.getNewAccessToken(authUser);
      const refreshToken = Token.getNewRefreshToken(authUser);

      res.status(StatusCodes.OK).json({
        success: true,
        message: '로그인 성공',
        data: {
          user: authUser,
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      console.error('기업 회원 로그인 실패:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '로그인 중 오류가 발생했습니다.',
      });
    }
  };

  // 토큰 재발급 (변경 없음)
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken as string;

      if (!refreshToken) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Refresh Token이 필요합니다.',
        });
        return;
      }

      const refreshResult = await Token.refreshTokens(refreshToken);

      if (
        refreshResult.ok &&
        refreshResult.accessToken &&
        refreshResult.refreshToken &&
        refreshResult.user
      ) {
        res.status(StatusCodes.OK).json({
          success: true,
          message: '새로운 Access Token과 Refresh Token이 발급되었습니다.',
          data: {
            accessToken: refreshResult.accessToken,
            refreshToken: refreshResult.refreshToken,
            user: refreshResult.user,
          },
        });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: refreshResult.message || '토큰 재발급에 실패했습니다. 다시 로그인해주세요.',
        });
      }
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '토큰 재발급 중 오류가 발생했습니다.',
      });
    }
  };

  // 로그아웃 (변경 없음)
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken as string;

      if (refreshToken) {
        await this.authModel.deleteRefreshToken(refreshToken);
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: '로그아웃 성공',
      });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '로그아웃 중 오류가 발생했습니다.',
      });
    }
  };
}