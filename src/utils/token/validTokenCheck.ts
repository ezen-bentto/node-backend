import { getCurrentDate } from '../common/getCurrentDate';
import { getDecodedData } from './getDecodedData';
import { refreshExpiredCheck } from './refreshExpiredCheck';

export const validTokenCheck = async (accessToken: string, refreshToken: string) => {
  const accessDecoded = getDecodedData(accessToken);
  const currentDate = getCurrentDate(); // 요쳥날린 시간의 currentDate 반환 함수
  if (accessDecoded.exp && accessDecoded.exp < currentDate) {
    if (refreshExpiredCheck(refreshToken, currentDate)) {
      // refreshToken 만료일을 비교하여 true/false 반환
      return { msg: 'refreshToken 무효' };
    } else {
      return { msg: 'accessToken 유효하지 않음' };
    }
  } else {
    return { msg: 'accessToken 유효' };
  }
};
