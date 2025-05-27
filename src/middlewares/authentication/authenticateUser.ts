import { Token } from '@/utils/token';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const refreshHeader = req.headers['refresh'] as string | undefined;

    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = refreshHeader && refreshHeader.split(' ')[1];

    // 1. Access Token이 없으면 로그인 안 된 상태 → 패스
    if (!accessToken || !refreshToken) {
      return next();
    }

    // 2. Access Token 검증
    const verified = await Token.validTokenCheck(accessToken, refreshToken);

    if (!verified || !verified.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: '토큰 검증 실패' });
    }

    // 3. 검증된 유저 정보 req.user 에 주입
    req.user = verified.user; // req에 user를 확장했다면 types 정의 필요

    return next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: '인증 실패', error: err });
  }
};
