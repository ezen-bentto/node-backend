import { ERROR_CODES } from '@/constants/error.constant';
import { CommentModel } from '@/models/comment.model';
import { RecruitmentDetailModel } from '@/models/recruitmentDetail.model';
import { CommentUpdateRequest } from '@/schemas/comment.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 *
 * @function updateComment
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           김혜미               신규작성 
 *  
 * @param data    CommentUpdateRequest
 */
export const updateComment = async (data: CommentUpdateRequest) => {
    // TODO : session에서 userId값 꺼내기
    // 글번호는? 화면에서 넘겨준다
    const userId = 5;
    const commentId = 20;

    logger.info(`댓글 수정 서비스 호출(userId: ${userId})`);
    try {
        const res = await CommentModel.updateComment(data, commentId, userId);

        if (res.affectedRows != 1) {
            logger.warn(`댓글 update 실패 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
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