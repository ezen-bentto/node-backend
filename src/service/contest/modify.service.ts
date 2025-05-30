import { handleDbError } from '@/utils/handleDbError';

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
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param 없음
 */
export const modContest = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
