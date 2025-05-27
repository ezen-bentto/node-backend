import { ENV } from '@/config/env.config';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyAccessToken = (token: string): { ok: boolean; payload?: JwtPayload } => {
  try {
    const payload = jwt.verify(token, ENV.jwt.secret) as JwtPayload;
    return { ok: true, payload };
  } catch {
    return { ok: false };
  }
};
