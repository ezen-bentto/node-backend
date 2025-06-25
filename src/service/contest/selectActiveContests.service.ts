import { ContestModel } from '@/models/contest.model';
import { handleDbError } from '@/utils/handleDbError';
import logger from '@/utils/common/logger';

/**
 *
 * @function selectActiveContests
 * @date 2025/06/24
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/24           김혜미               신규작성
 *
 * @param categoryId
 */
const selectActiveContests = async (categoryId: number) => {
  logger.info('진행중인 공모전 조회 서비스 호출');
  try {
    const res = await ContestModel.selectContestsByCategory(categoryId);
    logger.info('진행중인 공모전 조회 서비스 종료');

    return res;
  } catch (err: unknown) {
    logger.error('진행중인 공모전 조회 서비스 오류 발생', err);
    handleDbError(err);
    throw err;
  }
};

export default selectActiveContests;
