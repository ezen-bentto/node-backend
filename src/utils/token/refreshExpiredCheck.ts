import { getDecodedData } from './getDecodedData';

export const refreshExpiredCheck = (refreshToken: string, currentDate: number): boolean => {
  let result: boolean;
  const { exp } = getDecodedData(refreshToken);
  if (exp && exp < currentDate) {
    result = true;
  } else {
    result = false;
  }

  return result;
};
