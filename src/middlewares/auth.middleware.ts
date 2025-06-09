// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Token } from '../utils/token';
import { AuthModel } from '../models/auth/auth.model';
import { StatusCodes } from 'http-status-codes';
import { AuthUser, User } from '../types/auth.type';

// Express의 Request 객체에 user 속성 추가를 위한 타입 확장
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: '인증 토큰이 제공되지 않았습니다.',
      });
    }

    const accessToken = authHeader.split(' ')[1];
    const { ok, payload, message } = Token.verifyAccessToken(accessToken);

    if (!ok || !payload) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: message || '유효하지 않은 Access Token입니다.',
      });
    }

    const authModel = new AuthModel();
    // userFromDb의 타입을 AuthModel.findUserById의 반환 타입인 User | undefined로 명시합니다.
    const userFromDb: User | undefined = await authModel.findUserById(payload.userId);

    if (!userFromDb) { // userFromDb가 undefined이면 (사용자를 찾지 못하면)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    // payload.provider는 Access Token에 저장된 provider이므로 활용 가능합니다.
    // AccessTokenPayload 인터페이스에 provider가 정확히 명시되어 있다면 해당 타입을 따릅니다.
    // 여기서는 payload.provider가 'kakao' | 'naver' | 'google' | 'email' | undefined 일 수 있다고 가정합니다.
    const userProvider = payload.provider;

    let finalProvider: 'kakao' | 'naver' | 'google' | 'email';

    // userFromDb.user_type을 확인하여 개인/기업/관리자를 구분하고,
    // 개인 회원의 경우 userFromDb.provider (DB에서 가져온 값) 또는 payload.provider를 사용합니다.
    // 기업/관리자 회원의 경우 'email'로 고정합니다.
    if (userFromDb.user_type === '개인') {
      // DB에서 가져온 provider 값이 있다면 사용하고, 없다면 토큰 payload의 provider를 사용합니다.
      // 둘 다 없다면 'email'을 기본값으로 설정합니다.
      finalProvider = userFromDb.provider || (userProvider as 'kakao' | 'naver' | 'google' | 'email') || 'email';
    } else { // 기업 회원 또는 관리자
      finalProvider = 'email'; // 기업 회원은 이메일/비밀번호 기반 로그인으로 가정
    }

    const user: AuthUser = {
      id: userFromDb.user_id,
      loginId: userFromDb.login_id,
      email: userFromDb.email,
      nickname: userFromDb.nickname,
      profileImage: userFromDb.profile_image,
      provider: finalProvider, // 최종 결정된 provider 사용
      userType: userFromDb.user_type,
      approvalStatus: userFromDb.approval_status,
    };

    req.user = user;
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '서버 오류로 인해 인증에 실패했습니다.',
    });
  }
};