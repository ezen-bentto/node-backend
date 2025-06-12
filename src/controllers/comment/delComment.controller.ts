import { ERROR_CODES } from '@/constants/error.constant';
import { CommentDeleteRequest } from '@/schemas/comment.schema';
import { CommentService } from '@/service/comment.service';
import { AppError } from '@/utils/AppError';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 * ```
 * 패키지명: controllers/comment
 * 상세설명: 댓글 삭제 컨트롤러
 * ```
 *
 * @date 2025/06/010
 * @author 김혜미
 */
export const delComment: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`댓글 삭제 요청 시작 : ${req.ip}`);
    const parsed = CommentDeleteRequest.safeParse(req.body);

    if (!parsed.success) {
        logger.warn(`댓글 삭제 요청 검증 실패 : ${JSON.stringify(req.body)}`);
        next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
        return;
    }

    try {
        const result = await CommentService.deleteComment(parsed.data);
        logger.info(`댓글 삭제 성공 : ${JSON.stringify(result.affectedRows)}`);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data: data });
        return;
    } catch (err) {
        logger.error('댓글 삭제 중 오류 발생', err);
        next(err);
    }
};
