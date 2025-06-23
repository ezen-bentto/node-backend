// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { KakaoAuthService } from '../service/auth/kakao.service';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser } from '../types/auth.type';
import { ENV } from '../config/env.config';
import { kakaoConfig } from '../config/kakao.config';
import { Token } from '../utils/token'; // 통합된 Token 유틸리티 클래스 임포트
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

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

      let user = await this.authModel.findUserBySocialId(socialUser.socialId);

      let authUser: AuthUser;

      if (!user) {
        // 새 사용자인 경우 등록
        const newUserId = await this.authModel.createSocialUser(socialUser);
        user = await this.authModel.findUserById(newUserId);
        if (!user) {
          throw new Error('새 사용자 정보를 불러오지 못했습니다.');
        }
        authUser = {
          id: user.user_id,
          loginId: user.login_id, // login_id 추가
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profile_image,
          provider: 'kakao', // 소셜 로그인 프로바이더 명시
          userType: '개인', // 소셜 로그인은 개인 회원으로 가정
        };
      } else {
        // 기존 사용자인 경우 정보 업데이트
        await this.authModel.updateSocialUser(user.user_id, {
          nickname: socialUser.nickname,
          profileImage: socialUser.profileImage,
        });
        user = await this.authModel.findUserById(user.user_id); // 업데이트된 정보 다시 조회
        if (!user) {
          throw new Error('기존 사용자 정보를 불러오지 못했습니다.');
        }
        authUser = {
          id: user.user_id,
          loginId: user.login_id, // login_id 추가
          email: user.email,
          nickname: user.nickname,
          profileImage: user.profile_image,
          provider: 'kakao', // 소셜 로그인 프로바이더 명시
          userType: '개인',
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

  // 카카오 로그인 URL 반환
  getKakaoLoginUrl = (req: Request, res: Response): void => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoConfig.clientId}&redirect_uri=${encodeURIComponent(kakaoConfig.redirectUri)}&response_type=code`;

    res.status(StatusCodes.OK).json({
      success: true,
      data: { loginUrl: kakaoAuthUrl },
      message: '카카오 로그인 URL 생성',
    });
  };

  // 기업 회원 가입
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

      const userId = await this.authModel.createCompanyUser({ email, password, companyName, phoneNumber });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: '기업 회원가입이 완료되었습니다. 관리자 승인 대기 중입니다.',
        data: { userId: userId.toString() },
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
      if (user.user_type === '2') { // 기업회원일 경우
        if (user.approval_status !== '2') {
          res.status(StatusCodes.FORBIDDEN).json({ message: '아직 관리자의 승인이 필요한 계정입니다.' });
          return;
        }
      } else if (user.user_type !== '3') { // 관리자도 아닐 경우
        res.status(StatusCodes.FORBIDDEN).json({ message: '로그인 권한이 없습니다.' });
        return;
      }

      // JWT 토큰 생성 (Token 유틸리티의 getNewAccessToken, getNewRefreshToken 사용)
      const authUser: AuthUser = {
        id: Number(user.user_id),
        loginId: user.login_id,
        email: user.email,
        nickname: user.nickname,
        profileImage: user.profile_image,
        provider: 'email', // 기업 회원은 'email' 프로바이더
        userType: user.user_type, // '2'
        approvalStatus: user.approval_status, // '2'
      };

      const accessToken = Token.getNewAccessToken(authUser); // AuthUser 객체 전달
      const refreshToken = Token.getNewRefreshToken(authUser); // AuthUser 객체 전달

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

  // 토큰 재발급
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

      // Token.refreshTokens 사용
      const refreshResult = await Token.refreshTokens(refreshToken);

      if (refreshResult.ok && refreshResult.accessToken && refreshResult.refreshToken && refreshResult.user) {
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

  // 로그아웃
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.body.refreshToken as string; // 또는 헤더에서 받기

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