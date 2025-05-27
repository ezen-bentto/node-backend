import { ENV } from '@/config/env.config';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyRefreshToken = (token: string): { ok: boolean; payload?: JwtPayload } => {
  try {
    const payload = jwt.verify(token, ENV.jwt.refreshSecret) as JwtPayload;
    return { ok: true, payload };
  } catch {
    return { ok: false };
  }
};
