import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityRegisterRequest } from '@/schemas/commnutiy.schema';
import { CommunityService } from '@/service/community.service';
import { AppError } from '@/utils/AppError';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { sanitizeHtml } from '@/utils/common/sanitizeHtml';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 등록 컨트롤러
 * ```
 *
 * @date 2025/05/30
 * @author 김혜미
 */
export const regCommunityPost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const parsed = CommunityRegisterRequest.safeParse(req.body);

    if (!parsed.success) {
        next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
        return;
    }

    try {
        // content XSS 필터링 적용
        const cleanData = {
            ...parsed.data,
            content: sanitizeHtml(parsed.data.content || ''),
        };

        const result = await CommunityService.createCommunityPost(cleanData);
        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data: data });
        return;
    } catch (err) {
        console.error('커뮤니티 글 등록 중 오류:', err); // 이 부분이 있어야 원인 추적 가능

        next(err);
    }
};
