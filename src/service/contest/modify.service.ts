import { handleDbError } from '@/utils/handleDbError';

/**
 *
 * 공모전 수정 서비스
 *
 * @function modContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param 
 */
export const modContest = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
