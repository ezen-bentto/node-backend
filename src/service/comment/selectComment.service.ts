import { CommentModel } from '@/models/comment.model';
import { handleDbError } from '@/utils/handleDbError';
import logger from '@/utils/common/logger';

/**
 *
 *
 * @function selectComment
 * @date 2025/06/10
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/10           김혜미               신규작성 
 *  
 * @param communityId
 */
export const selectComment = async (
    communityId: number
) => {
    logger.info('댓글 목록 서비스 호출');
    try {
        const res = await CommentModel.selectComment(communityId);
        logger.info('댓글 목록 서비스 종료');

        return res;
    } catch (err) {
        logger.error('댓글 목록 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};