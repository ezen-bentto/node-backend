import { ERROR_CODES } from '@/constants/error.constant';
import { ContestModel } from '@/models/contest.model';
import { ContestCreate } from '@/schemas/content.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 등록 서비스
 *
 * @function regContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param data
 */
export const regContest = async (data: ContestCreate) => {
  try {
    const res = await ContestModel.regContest(data);

    if(res.affectedRows != 1){
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
    }
    return res;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
