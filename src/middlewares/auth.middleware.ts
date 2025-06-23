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
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: '인증 토큰이 제공되지 않았습니다.',
      });
      return; // 응답을 보냈으므로 함수를 여기서 종료
    }

    const accessToken = authHeader.split(' ')[1];
    const { ok, payload, message } = Token.verifyAccessToken(accessToken);

    if (!ok || !payload) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: message || '유효하지 않은 Access Token입니다.',
      });
      return; // 응답을 보냈으므로 함수를 여기서 종료
    }

    const authModel = new AuthModel();
    const userFromDb: User | undefined = await authModel.findUserById(Number(payload.userId)); // payload의 userId가 BigInt일 수 있으므로 Number로 변환

    if (!userFromDb) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
      return; // 응답을 보냈으므로 함수를 여기서 종료
    }
    
    const userProvider = payload.provider;
    let finalProvider: 'kakao' | 'naver' | 'google' | 'email' = 'email'; // 기본값 email

    if (userFromDb.user_type === '1') { // '개인' -> '1'
        finalProvider = userFromDb.provider as 'kakao' || userProvider as 'kakao' || 'kakao';
    }
    
    const user: AuthUser = {
      id: Number(userFromDb.user_id), // DB에서 온 BigInt를 Number로 변환
      loginId: userFromDb.login_id,
      email: userFromDb.email,
      nickname: userFromDb.nickname,
      profileImage: userFromDb.profile_image,
      provider: finalProvider,
      userType: userFromDb.user_type,
      approvalStatus: userFromDb.approval_status,
    };

    req.user = user; // 요청 객체(req)에 사용자 정보를 심어줌
    next(); // 모든 검사를 통과했으므로, 다음 미들웨어나 컨트롤러로 제어를 넘김
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '서버 오류로 인해 인증에 실패했습니다.',
    });
  }
};