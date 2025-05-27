import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';

export const detail = async () => {
  try {
    const res = '모델 만들어!';

    // if (res.affectedRows !== 1) {
    //   throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
    // }

    return;
  } catch (err: unknown) {
    // 예: 중복 키 에러 처리
    handleDbError(err);
    throw err;
  }
};
