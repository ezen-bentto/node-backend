import { ERROR_CODES } from '@/constants/error.constant';
import { ContestModel } from '@/models/contest.model';
import { modContest as modContestParam} from '@/schemas/content.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

/**
 *
 * 공모전 수정 서비스
 *
 * 전달받은 데이터를 기반으로 기존 공모전 정보를 수정하고,
 * 수정 결과를 반환합니다.
 * 데이터베이스와 연동하여 변경 사항을 적용하며,
 * 오류 발생 시 적절히 처리합니다.
 *
 * @function modContest
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리             신규작성  
 * @param contestId
 * @param data
 */
export const modContest = async (contestId: number, data: Partial<modContestParam>) => {
  try {
    const res = await ContestModel.modContest(contestId, data);
    
    if(res.affectedRows != 1){
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.UPDATE_FAIL);
    }

    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
