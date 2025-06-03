import { CommunityService } from '@/service/community.service';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/common/logger';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 상세 조회 컨트롤러
 * ```
 *
 * @date 2025/06/03
 * @author 김혜미
 */

export const getCommunityDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info(`커뮤니티 글 상세 요청 시작 : ${req.ip}`);

        const communityId = Number(req.query.communityId);

        if (isNaN(communityId) || communityId <= 0) {
            logger.warn(`커뮤니티 글 상세 요청 검증 실패 : ${JSON.stringify(req.query)}`);
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        const result = await CommunityService.selectCommunityDetail(communityId);

        if (!result) {
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }
        logger.info(`커뮤니티 글 상세 조회 성공 : ${JSON.stringify(result)}`);

        res.status(StatusCodes.OK).json({ data: result });
    } catch (err) {
        logger.error('커뮤니티 글 상세 조회 중 오류 발생', err);
        next(err);
    }
};
