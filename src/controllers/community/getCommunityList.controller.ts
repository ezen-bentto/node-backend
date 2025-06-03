import { CommunitySelectRequest } from '@/schemas/commnutiy.schema';
import { selectCommunityList } from '@/service/community/selectCommunityList.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import logger from '@/utils/common/logger';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 목록 조회 컨트롤러
 * ```
 *
 * @date 2025/06/03
 * @author 김혜미
 */

export const getCommunityList = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info(`커뮤니티 목록 요청 시작 : ${req.ip}`);
        const parsed = CommunitySelectRequest.safeParse(req.query);

        if (!parsed.success) {
            logger.warn(`커뮤니티 목록 요청 검증 실패 : ${JSON.stringify(req.body)}`);
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        const { page = '1', size = '10' } = req.query;

        const data = await selectCommunityList(
            parsed.data,
            parseInt(page as string, 10),
            parseInt(size as string, 10)
        );
        logger.info(`커뮤니티 목록 조회 성공 : ${JSON.stringify(data.list)}`);

        res.status(StatusCodes.OK).json({ data: data });
    } catch (err) {
        logger.error('커뮤니티 목록 조회 중 오류 발생', err);
        next(err);
    }
};