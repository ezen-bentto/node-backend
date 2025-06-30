// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { KakaoAuthService } from '../service/auth/kakao.service';
import { NaverAuthService } from '../service/auth/naver.service';
import { GoogleAuthService } from '../service/auth/google.service';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser, User, SocialUser  } from '../types/auth.type'; // User 타입 임포트
import { ENV } from '../config/env.config';
import { kakaoConfig } from '../config/kakao.config';
import { naverConfig } from '../config/naver.config';
import { googleConfig } from '../config/google.config';
import { Token } from '../utils/token';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { 
  mapDbProviderToService, 
  mapDbUserTypeToService, 
  mapDbApprovalStatusToService 
} from '../utils/mapper'; 
import crypto from 'crypto';


export class AuthController {
  private kakaoAuthService = new KakaoAuthService();
  private naverAuthService = new NaverAuthService();
  private googleAuthService = new GoogleAuthService();
  private authModel = new AuthModel();

  private handleSocialLogin = async (
    socialUser: SocialUser,
    service: KakaoAuthService | NaverAuthService | GoogleAuthService
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    let user: User | undefined = await this.authModel.findUserBySocialId(socialUser.socialId);
    let authUser: AuthUser;

    if (!user) {
      // 새 사용자
      const newUserId = await this.authModel.createSocialUser(socialUser);
      user = await this.authModel.findUserById(Number(newUserId));
    } else {
      // 기존 사용자 정보 업데이트 : 최초 가입 이후는 사이트 DB에서 다루기 위해 주석처리
      // await this.authModel.updateSocialUser(Number(user.user_id), {
      //   nickname: socialUser.nickname,
      //   profileImage: socialUser.profileImage,
      // });
      // user = await this.authModel.findUserById(Number(user.user_id));
    }

    if (!user) {
      throw new Error('사용자 정보를 처리하는 데 실패했습니다.');
    }

    authUser = {
      id: user.user_id.toString(),
      loginId: user.login_id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profile_image,
      provider: mapDbProviderToService(user.provider) || socialUser.provider,
      userType: mapDbUserTypeToService(user.user_type) || '개인',
      approvalStatus: mapDbApprovalStatusToService(user.approval_status),
    };

    return service.generateTokens(authUser);
  };

  // 카카오 콜백
  kakaoCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        throw new Error('인증 코드가 없습니다.');
      }

      const accessToken = await this.kakaoAuthService.getKakaoAccessToken(code);
      const socialUser = await this.kakaoAuthService.getKakaoUserInfo(accessToken);

      const { accessToken: jwtAccessToken, refreshToken } = await this.handleSocialLogin(
        socialUser,
        this.kakaoAuthService
      );

      const redirectUrl = `${ENV.corsOrigin}/login?token=${jwtAccessToken}&refresh=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('카카오 로그인 실패:', error);
      res.redirect(`${ENV.corsOrigin}/login?error=social_login_failed`);
    }
  };

  // [추가] 네이버 콜백
  naverCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, state } = req.query;
      if (!code || typeof code !== 'string' || !state || typeof state !== 'string') {
        throw new Error('인증 코드가 없습니다.');
      }
      // 실제 프로덕션에서는 세션에 저장된 state와 비교하는 로직이 필요합니다.
      // if (req.session.state !== state) { ... }

      const accessToken = await this.naverAuthService.getNaverAccessToken(code, state);
      const socialUser = await this.naverAuthService.getNaverUserInfo(accessToken);

      const { accessToken: jwtAccessToken, refreshToken } = await this.handleSocialLogin(
        socialUser,
        this.naverAuthService
      );

      const redirectUrl = `${ENV.corsOrigin}/login?token=${jwtAccessToken}&refresh=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('네이버 로그인 실패:', error);
      res.redirect(`${ENV.corsOrigin}/login?error=social_login_failed`);
    }
  };

  // [추가] 구글 콜백
  googleCallback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        throw new Error('인증 코드가 없습니다.');
      }

      const accessToken = await this.googleAuthService.getGoogleAccessToken(code);
      const socialUser = await this.googleAuthService.getGoogleUserInfo(accessToken);

      const { accessToken: jwtAccessToken, refreshToken } = await this.handleSocialLogin(
        socialUser,
        this.googleAuthService
      );

      const redirectUrl = `${ENV.corsOrigin}/login?token=${jwtAccessToken}&refresh=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      res.redirect(`${ENV.corsOrigin}/login?error=social_login_failed`);
    }
  };

  // 카카오 로그인 URL 반환
  getKakaoLoginUrl = (req: Request, res: Response): void => {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${
      kakaoConfig.clientId
    }&redirect_uri=${encodeURIComponent(kakaoConfig.redirectUri)}&response_type=code`;
    res.status(StatusCodes.OK).json({ success: true, data: { loginUrl: url } });
  };

  // [추가] 네이버 로그인 URL 반환
  getNaverLoginUrl = (req: Request, res: Response): void => {
    const state = crypto.randomBytes(16).toString('hex');
    // 실제 프로덕션에서는 CSRF 공격 방지를 위해 이 state 값을 세션에 저장해야 합니다.
    // req.session.state = state;
    const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
      naverConfig.clientId
    }&redirect_uri=${encodeURIComponent(naverConfig.redirectUri)}&state=${state}`;
    res.status(StatusCodes.OK).json({ success: true, data: { loginUrl: url } });
  };

  // [추가] 구글 로그인 URL 반환
  getGoogleLoginUrl = (req: Request, res: Response): void => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      googleConfig.clientId
    }&redirect_uri=${encodeURIComponent(
      googleConfig.redirectUri
    )}&response_type=code&scope=email profile`;
    res.status(StatusCodes.OK).json({ success: true, data: { loginUrl: url } });
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