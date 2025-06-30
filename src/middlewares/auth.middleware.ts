// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Token } from '../utils/token';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser, User } from '../types/auth.type';
import { StatusCodes } from 'http-status-codes';
import {
  mapDbProviderToService,
  mapDbUserTypeToService,
  mapDbApprovalStatusToService,
} from '../utils/mapper'; // 매핑 함수 임포트

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
      return;
    }

    const accessToken = authHeader.split(' ')[1];
    // verifyAccessToken의 payload.userId는 이미 string일 것으로 예상됨 (토큰 생성 시 String() 변환하므로)
    const { ok, payload, message } = Token.verifyAccessToken(accessToken);

    // payload.userId가 string이 아닐 경우를 대비해 타입 가드 추가
    if (!ok || !payload || !payload.userId || typeof payload.userId !== 'string') {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: message || '유효하지 않은 Access Token입니다. 사용자 ID 정보 부족.',
      });
      return;
    }

    const authModel = new AuthModel();
    // payload.userId는 string이므로, DB 조회 시에는 Number()로 변환해야 함 (user_id가 number | bigint이므로)
    const userFromDb: User | undefined = await authModel.findUserById(Number(payload.userId));

    if (!userFromDb) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
      return;
    }

    // AuthUser 객체 생성 시 DB 값들을 매핑 함수를 통해 변환
    const user: AuthUser = {
      id: String(userFromDb.user_id), // DB에서 온 BigInt/Number를 String으로 변환
      loginId: userFromDb.login_id,
      email: userFromDb.email,
      nickname: userFromDb.nickname,
      profileImage: userFromDb.profile_image,
      provider: mapDbProviderToService(userFromDb.provider), // DB 값을 서비스 문자열로 매핑
      userType: mapDbUserTypeToService(userFromDb.user_type), // DB 값을 서비스 문자열로 매핑
      approvalStatus: mapDbApprovalStatusToService(userFromDb.approval_status), // DB 값을 서비스 문자열로 매핑
    };

    req.user = user;
    next();
  } catch (error) {
    console.error('인증 미들웨어 오류:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '서버 오류로 인해 인증에 실패했습니다.',
    });
  }
};
