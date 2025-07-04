import { ContestModel } from '@/models/contest.model';
import { getContestList as getContestLisParam } from '@/schemas/content.schema';
import { handleDbError } from '@/utils/handleDbError';
import { promises } from 'dns';
import { optionResult } from '@/types/db/request.type';
import { any } from 'zod';

/**
 *
 * 공모전 리스트 서비스
 *
 * 모든 공모전의 목록을 조회하여 반환하는 기능을 수행합니다.
 * 데이터베이스와의 연동을 통해 공모전 정보를 가져옵니다.
 *
 * @function getContestList
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성
 * @param 없음
 */
const getContestList = async (options: optionResult = {}): Promise<getContestLisParam[]> => {
  try {
    const contestData = await ContestModel.selectList(options);
    return contestData;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};

export default getContestList;
