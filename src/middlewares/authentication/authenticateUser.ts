import { ENV } from '@/config/env.config';
import { Token } from '@/utils/token';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // 로그인 요청
  if (token == null || token === undefined) {
    req.user = { isLoggedIn: false };
    return next();
  }

  const verified = Token.validTokenCheck(token);
};
