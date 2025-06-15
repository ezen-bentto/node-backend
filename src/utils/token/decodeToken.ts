//src\utils\token\decodeToken.ts
import jwt, { JwtPayload } from 'jsonwebtoken';

export const decodeToken = (token: string): JwtPayload => {
  const data = jwt.decode(token) as JwtPayload;
  return data;
};
