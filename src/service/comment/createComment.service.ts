import { ERROR_CODES } from '@/constants/error.constant';
import { CommentModel } from '@/models/comment.model';
import { CommentRegisterRequest } from '@/schemas/comment.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 *
 * @function createComment
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           김혜미               신규작성  
 *        2025/06/11           수정자               postId 처리 추가
 * @param data(CommentRegisterRequest) - content, postId 포함
 */
export const createComment = async (data: CommentRegisterRequest) => {
    // TODO : session에서 userId값 꺼내기 (임시로 5 사용)
    const userId = 5;
    const postId = data.postId; // 프론트엔드에서 받은 postId 사용

    logger.info(`댓글 등록 서비스 호출(userId: ${userId}, postId: ${postId})`);

    // postId 유효성 검사
    if (!postId || isNaN(postId)) {
        logger.warn(`유효하지 않은 postId: ${postId}`);
        throw new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL);
    }

    try {
        const res = await CommentModel.insertComment(data, postId, userId);

        if (res.affectedRows != 1) {
            logger.warn(`댓글 insert 실패 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }
        logger.debug(`댓글 insert 성공 : ${res.insertId}`);

        logger.info(`댓글 등록 서비스 종료(userId: ${userId}, postId: ${postId})`);
        return res;
    } catch (err) {
        logger.error(`댓글 등록 서비스 오류 발생 (postId: ${postId})`, err);
        handleDbError(err);
        throw err;
    }
};