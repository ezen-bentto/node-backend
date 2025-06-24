import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityRegisterRequest } from '@/schemas/community.schema';
import { CommunityService } from '@/service/community.service';
import { AppError } from '@/utils/AppError';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { sanitizeHtml } from '@/utils/common/sanitizeHtml';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 등록 컨트롤러
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
export const regCommunityPost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`커뮤니티 글 등록 요청 시작 : ${req.ip}`);
    const parsed = CommunityRegisterRequest.safeParse(req.body);

    if (!parsed.success) {
        logger.warn(`커뮤니티 글 등록 요청 검증 실패 : ${JSON.stringify(req.body)}`);
        next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
        return;
    }

    try {
        if (!req.user) {
            // 혹시 인증 미들웨어 누락되었을 때 방어 코드
            logger.warn(`인증 정보 누락: ${req.ip}`);
            next(new AppError(StatusCodes.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED));
            return;
        }

        // content XSS 필터링 + 작성자 ID 추가
        const cleanData = {
            ...parsed.data,
            content: sanitizeHtml(parsed.data.content || ''),
        };

        const result = await CommunityService.createCommunityPost(cleanData, Number(req.user.id));

        logger.info(`커뮤니티 글 등록 성공 : ${JSON.stringify(serializeBigInt(result.insertId))}`);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data });
        return;
    } catch (err) {
        logger.error('커뮤니티 글 등록 중 오류 발생', err);
        next(err);
    }
};
