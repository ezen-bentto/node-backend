import { handleDbError } from '@/utils/handleDbError';

/**
 *
 * 공모전 리스트 서비스
 *
 * @function getContestList
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param 
 */
export const getContestList = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
