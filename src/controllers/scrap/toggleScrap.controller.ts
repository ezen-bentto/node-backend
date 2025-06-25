import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/utils/AppError';
import { ScrapService } from '@/service/scrap.service';
import logger from '@/utils/common/logger';
import { ERROR_CODES } from '@/constants/error.constant';
import { RequestHandler } from 'express';
import { serializeBigInt } from '@/utils/common/serializeBigInt';

export const toggleScrap: RequestHandler = async (req, res, next) => {
    logger.info(`스크랩 등록/해제 요청 시작: ${req.ip}`);

    try {
        // 인증 체크 (테스트 중 주석 처리)
        if (!req.user) {
            logger.warn(`스크랩 요청 인증 정보 누락: ${req.ip}`);
            throw new AppError(StatusCodes.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
        }

        const { targetId } = req.body;
        if (!targetId || isNaN(Number(targetId))) {
            throw new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL);
        }

        const result = await ScrapService.toggleScrap(Number(targetId), Number(req.user.id), '2'); // '2' = 커뮤니티

        // BigInt 변환 후 응답
        res.status(StatusCodes.OK).json({ data: serializeBigInt(result) });
    } catch (err) {
        logger.error('스크랩 등록/해제 중 오류 발생', err);
        next(err);
    }
};
