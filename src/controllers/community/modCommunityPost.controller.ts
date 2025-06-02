import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityUpdateRequest } from '@/schemas/commnutiy.schema';
import { CommunityService } from '@/service/community.service';
import { AppError } from '@/utils/AppError';
import { serializeBigInt } from '@/utils/common/serializeBigInt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

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
    const parsed = CommunityUpdateRequest.safeParse(req.body);

    if (!parsed.success) {
        next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
        return;
    }

    try {
        const result = await CommunityService.updateCommunityPost(parsed.data);

        const data = serializeBigInt(result);

        res.status(StatusCodes.OK).json({ data: data });
        return;
    } catch (err) {
        next(err);
    }
};
