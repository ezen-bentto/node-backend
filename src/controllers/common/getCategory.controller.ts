import { selectCategory } from '@/service/common/selectCategory.service';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/common/logger';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';

/**
 * ```
 * 패키지명: controllers/common
 * 상세설명: 카테고리 목록 조회 컨트롤러
 * ```
 *
 * @date 2025/06/10
 * @author 김혜미
 */

export const getCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info(`카테고리 목록 요청 시작 : ${req.ip}`);

        const data = await selectCategory();
        logger.info("카테고리 목록 조회 성공");

        res.status(StatusCodes.OK).json({ data: data });
    } catch (err) {
        logger.error('카테고리 목록 조회 중 오류 발생', err);
        next(err);
    }
};