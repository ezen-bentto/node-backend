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
 * @date 2025/06/02
 * @author 김혜미
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
        // content XSS 필터링 적용
        const cleanData = {
            ...parsed.data,
            content: sanitizeHtml(parsed.data.content || ''),
        };

        const result = await CommunityService.updateCommunityPost(cleanData);
        logger.info(`커뮤니티 수정 성공 : ${JSON.stringify(result.affectedRows)}`);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data: data });
        return;
    } catch (err) {
        logger.error('커뮤니티 글 수정 중 오류 발생', err);
        next(err);
    }
};
