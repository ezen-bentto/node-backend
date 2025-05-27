import jwt, { JwtPayload } from 'jsonwebtoken';

export const getDecodedData = (token: string): JwtPayload => {
  const data = jwt.decode(token) as JwtPayload;
  return data;
};
