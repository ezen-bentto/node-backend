import { ContestService } from '@/service/contest.service';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/common/logger';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 카테고리별 공모전 목록 조회 컨트롤러
 * ```
 *
 * @date 2025/06/24
 * @author 김혜미
 * @param categoryId
 */

export const getContestsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info(`카테고리별 공모전 목록 요청 시작 : ${req.ip}`);

        const categoryId = Number(req.query.categoryId);
        const result = await ContestService.selectActiveContests(categoryId);

        if (!result) {
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        // BigInt를 Number로 변환
        const serializedResult = result.map(item => ({
            ...item,
            contest_id: Number(item.contest_id)
        }));

        logger.info(`카테고리별 공모전 목록 조회성공 : ${JSON.stringify(serializedResult)}`);

        res.status(StatusCodes.OK).json({
            success: true,
            data: serializedResult
        });
    } catch (err) {
        logger.error('카테고리별 공모전 목록 조회중 오류 발생', err);
        next(err);
    }
};