import { CommonModel } from '@/models/common.model';
import { handleDbError } from '@/utils/handleDbError';
import logger from '@/utils/common/logger';

/**
 *
 *
 * @function selectCategory
 * @date 2025/06/10
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/10           김혜미               신규작성 
 *  
 */
export const selectCategory = async (
) => {
    logger.info('카테고리 목록 서비스 호출');
    try {
        const res = await CommonModel.selectCategory();
        logger.info('카테고리 목록 서비스 종료');

        return res;
    } catch (err) {
        logger.error('카테고리 목록 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};