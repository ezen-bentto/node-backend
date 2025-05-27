import { ENV } from '@/config/env.config';
import jwt from 'jsonwebtoken';

export const getNewAccessToken = (userId: number, nickName: string): string => {
  const user = {
    userId,
    nickName,
  };

  const accessToken = jwt.sign(user, ENV.jwt.secret, { expiresIn: '1h' });

  return accessToken;
};
