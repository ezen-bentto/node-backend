import { ENV } from '@/config/env.config';
import jwt from 'jsonwebtoken';

export const getNewRefreshToken = (userId: number, nickName: string): string => {
  const refreshToken = jwt.sign(
    {
      userId: userId,
      nickName: nickName,
    },
    ENV.jwt.secret,
    {
      expiresIn: '1h',
    }
  );
  return refreshToken;
};
