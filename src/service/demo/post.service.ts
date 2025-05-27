import { DemoCreate } from '@/schemas/demo.schema';
import { DemoModel } from '@/models/demo.model';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';

export const post = async (data: DemoCreate) => {
  try {
    const res = await DemoModel.create(data);

    if (res.affectedRows !== 1) {
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
    }

    return;
  } catch (err: unknown) {
    // 예: 중복 키 에러 처리
    handleDbError(err);
    throw err;
  }
};
