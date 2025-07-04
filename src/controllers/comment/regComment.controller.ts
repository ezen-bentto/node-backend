import { ERROR_CODES } from '@/constants/error.constant';
import { CommentRegisterRequest } from '@/schemas/comment.schema';
import { CommentService } from '@/service/comment.service';
import { AppError } from '@/utils/AppError';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 * ```
 * 패키지명: controllers/comment
 * 상세설명: 댓글 등록 컨트롤러
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
export const regComment: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`댓글 등록 요청 시작 : ${req.ip}`);
    logger.debug(`요청 데이터: ${JSON.stringify(req.body)}`);

    const parsed = CommentRegisterRequest.safeParse(req.body);

    if (!parsed.success) {
        logger.warn(`댓글 등록 요청 검증 실패 : ${JSON.stringify(req.body)}`);
        logger.warn(`검증 오류: ${JSON.stringify(parsed.error.issues)}`);
        next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
        return;
    }

    try {
        if (!req.user) {
            logger.warn(`인증 정보 누락: ${req.ip}`);
            next(new AppError(StatusCodes.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED));
            return;
        }

        const result = await CommentService.createComment(parsed.data, Number(req.user.id));

        logger.info(`댓글 등록 성공 : ${JSON.stringify(serializeBigInt(result.insertId))}`);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data });
        return;
    } catch (err) {
        logger.error('댓글 등록 중 오류 발생', err);
        next(err);
    }
};
