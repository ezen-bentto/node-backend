import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { delContest, detailContest} from '@/schemas/content.schema';
import { ContestModel } from '@/models/contest.model';

/**
 *
 * 공모전 상세 수정 조회 서비스
 *
 * 클라이언트로부터 전달받은 공모전 ID를 기반으로 상세 정보를 조회합니다.
 *
 * @function getContestById
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리             신규작성  
 * @param data 조회할 공모전의 상세 정보 요청 데이터 (ID 등)
 */
export const getContestById = async ({ id }: delContest): Promise<detailContest> => {
  try {
    const contestData = await ContestModel.getContestById(id);

    if (contestData === undefined){
      new AppError(StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    return contestData;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
