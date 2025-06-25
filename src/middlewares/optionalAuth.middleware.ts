// src/middlewares/optionalAuth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { Token } from '../utils/token';
import { AuthModel } from '../models/auth/auth.model';
import { AuthUser, User } from '../types/auth.type';
import {
    mapDbProviderToService,
    mapDbUserTypeToService,
    mapDbApprovalStatusToService,
} from '../utils/mapper';

// Express의 Request 객체에 user 속성 추가를 위한 타입 확장
declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthUser;
    }
}

/**
 * 선택적 인증 미들웨어
 * - Authorization 헤더가 없거나 토큰이 잘못되어도 요청을 차단하지 않음
 * - 토큰이 유효하면 req.user에 유저 정보 주입
 * - 실패하면 req.user = undefined 로 설정
 */
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            req.user = undefined; // 로그인하지 않은 사용자
            return next();
        }

        const accessToken = authHeader.split(' ')[1];
        const { ok, payload } = Token.verifyAccessToken(accessToken);

        if (!ok || !payload?.userId || typeof payload.userId !== 'string') {
            req.user = undefined;
            return next();
        }

        const authModel = new AuthModel();
        const userFromDb: User | undefined = await authModel.findUserById(Number(payload.userId));

        if (!userFromDb) {
            req.user = undefined;
            return next();
        }

        const user: AuthUser = {
            id: String(userFromDb.user_id),
            loginId: userFromDb.login_id,
            email: userFromDb.email,
            nickname: userFromDb.nickname,
            profileImage: userFromDb.profile_image,
            provider: mapDbProviderToService(userFromDb.provider),
            userType: mapDbUserTypeToService(userFromDb.user_type),
            approvalStatus: mapDbApprovalStatusToService(userFromDb.approval_status),
        };

        req.user = user;
        next();
    } catch (error) {
        console.error('선택적 인증 미들웨어 오류:', error);
        req.user = undefined;
        next(); // 절대 요청 차단하지 않음
    }
};
