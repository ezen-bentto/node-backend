import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { client } from '@/config/redis.config';
import { NextFunction } from 'express';
import { delContest as delContestParam } from '@/schemas/content.schema';
import { ContestModel } from '@/models/contest.model';

/**
 *
 * 공모전 삭제 서비스
 *
 * 컨트롤러로부터 전달받은 공모전 정보(contestId)를 바탕으로
 * 해당 공모전을 데이터베이스와 모델을 연결해 삭제하는 기능을 수행합니다.
 *
 * @function delContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리             신규작성
 * @param 없음
 */
const delContest = async ({ id }: delContestParam) => {
  try {
    const data = await ContestModel.delContest(id);
    return data;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};

export default delContest;
