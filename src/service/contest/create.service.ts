import { ERROR_CODES } from '@/constants/error.constant';
import { ContestModel } from '@/models/contest.model';
import { ContestCreate } from '@/schemas/content.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

export const create = async (data: ContestCreate) => {
  try {
    const res = await ContestModel.create(data);

    if(res.affectedRows != 1){
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
    }
    return res;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
