import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityUpdateRequest } from '@/schemas/community.schema';
import { CommunityService } from '@/service/community.service';
import { AppError } from '@/utils/AppError';
import { sanitizeHtml } from '@/utils/common/sanitizeHtml';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 수정 컨트롤러
 * ```
 *
 * @date 2025/05/30
 * @author 김혜미
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/24           김혜미             userId 파라미터 추가
 */
export const modCommunityPost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`커뮤니티 수정 요청 시작 : ${req.ip}`);
    const parsed = CommunityUpdateRequest.safeParse(req.body);

    if (!parsed.success) {
        logger.warn(`커뮤니티 수정 요청 검증 실패 : ${JSON.stringify(req.body)}`);
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

        // userId를 서비스에 전달
        const result = await CommunityService.updateCommunityPost(cleanData, Number(req.user.id));

        logger.info(`커뮤니티 수정 성공 : ${JSON.stringify(result.affectedRows)}`);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data });
        return;
    } catch (err) {
        logger.error('커뮤니티 글 수정 중 오류 발생', err);
        next(err);
    }
};
