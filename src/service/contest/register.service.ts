import { ERROR_CODES } from '@/constants/error.constant';
import { ContestModel } from '@/models/contest.model';
import { regContest as regContestParams } from '@/schemas/content.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 등록 서비스
 *
 * 클라이언트로부터 전달받은 공모전 정보를
 * 데이터베이스에 저장하고, 저장 결과를 반환합니다.
 *
 * @function regContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param data - 공모전 등록에 필요한 데이터 객체
 */
export const regContest = async (data: regContestParams) => {
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
