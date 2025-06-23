// src/types/express.d.ts
import { AuthUser } from './auth.type';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser; // req.user에 사용자 정보가 담길 수 있도록 선언
    }
  }
}