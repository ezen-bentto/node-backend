import { decodeToken } from './decodeToken';

export const refreshExpiredCheck = (refreshToken: string, currentDate: number): boolean => {
  let result: boolean;
  const { exp } = decodeToken(refreshToken);
  if (exp && exp < currentDate) {
    result = true;
  } else {
    result = false;
  }

  return result;
};
