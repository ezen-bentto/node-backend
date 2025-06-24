import { ERROR_CODES } from '@/constants/error.constant';
import { CommentModel } from '@/models/comment.model';
import { CommentDeleteRequest } from '@/schemas/comment.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 * @function deleteComment
 * @date 2025/06/10
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미              신규작성  
 *        2025/06/24           김혜미              userId 파라미터화
 * 
 * @param commentId 댓글 ID
 * @param userId 작성자 ID
 */
export const deleteComment = async (
    data: CommentDeleteRequest,
    userId: number
) => {

    const { commentId } = data;
    logger.info(`댓글 삭제 서비스 호출(userId: ${userId}, commentId: ${commentId})`);

    try {
        const res = await CommentModel.deleteComment(data, userId);

        if (res.affectedRows !== 1) {
            logger.warn(`댓글 delete 실패 또는 권한 없음 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.FORBIDDEN, ERROR_CODES.FORBIDDEN);
        }
        logger.debug(`댓글 delete 성공 : ${res.affectedRows}`);

        logger.info(`댓글 삭제 서비스 종료(userId: ${userId}, commentId: ${commentId})`);
        return res;
    } catch (err) {
        logger.error('댓글 삭제 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};
