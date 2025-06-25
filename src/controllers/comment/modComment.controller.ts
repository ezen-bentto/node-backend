import { ERROR_CODES } from '@/constants/error.constant';
import { CommentUpdateRequest } from '@/schemas/comment.schema';
import { CommentService } from '@/service/comment.service';
import { AppError } from '@/utils/AppError';
import { sanitizeHtml } from '@/utils/common/sanitizeHtml';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 * ```
 * 패키지명: controllers/comment
 * 상세설명: 댓글 수정 컨트롤러
 * ```
 *
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/24           김혜미             userId 파라미터 추가
 */
export const modComment: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`댓글 수정 요청 시작 : ${req.ip}`);
    const parsed = CommentUpdateRequest.safeParse(req.body);

    if (!parsed.success) {
        logger.warn(`댓글 수정 요청 검증 실패 : ${JSON.stringify(req.body)}`);
        next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
        return;
    }

    try {
        if (!req.user) {
            logger.warn(`인증 정보 누락: ${req.ip}`);
            next(new AppError(StatusCodes.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED));
            return;
        }

        // content XSS 필터링 + userId 전달
        const cleanData = {
            ...parsed.data,
            content: sanitizeHtml(parsed.data.content || ''),
        };

        const result = await CommentService.updateComment(
            cleanData,
            Number(req.user.id)
        );

        logger.info(`댓글 수정 성공 : ${JSON.stringify(result.affectedRows)}`);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data });
        return;
    } catch (err) {
        logger.error('댓글 수정 중 오류 발생', err);
        next(err);
    }
};
