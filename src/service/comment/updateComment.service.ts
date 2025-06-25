import { ERROR_CODES } from '@/constants/error.constant';
import { CommentModel } from '@/models/comment.model';
import { CommentUpdateRequest } from '@/schemas/comment.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 * @function updateComment
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           김혜미               신규작성 
 *        2025/06/24           김혜미               userId 파라미터화
 *  
 * @param data    CommentUpdateRequest
 * @param userId  로그인 사용자 ID
 */
export const updateComment = async (
    data: CommentUpdateRequest,
    userId: number
) => {
    logger.info(`댓글 수정 서비스 호출(userId: ${userId})`);
    try {
        const res = await CommentModel.updateComment(data, userId);

        if (res.affectedRows !== 1) {
            logger.warn(`댓글 update 실패 또는 권한 없음 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.FORBIDDEN, ERROR_CODES.FORBIDDEN);
        }
        logger.debug(`댓글 update 성공 : ${res.affectedRows}`);

        logger.info(`댓글 수정 서비스 종료(userId: ${userId})`);
        return res;
    } catch (err) {
        logger.error('댓글 수정 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};
