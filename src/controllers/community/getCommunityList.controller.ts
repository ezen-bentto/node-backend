import { selectCommunityList } from '@/service/community/selectCommunityList.service';
import { Request, Response, NextFunction } from 'express';
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
        logger.info(`community_type: ${req.query.community_type}, type: ${typeof req.query.community_type}`);

        logger.info(`커뮤니티 목록 요청 시작 : ${req.ip}`);

        // 쿼리 파라미터에서 값 추출
        const { community_type, page = '1', size = '10' } = req.query;

        // 기본 validation
        if (community_type && typeof community_type !== 'string') {
            logger.warn(`커뮤니티 목록 요청 검증 실패 : community_type이 문자열이 아님`);
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        // 페이지, 사이즈 validation
        const pageNum = parseInt(page as string, 10);
        const sizeNum = parseInt(size as string, 10);

        if (isNaN(pageNum) || pageNum < 1) {
            logger.warn(`커뮤니티 목록 요청 검증 실패 : 잘못된 page 값 ${page}`);
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 100) {
            logger.warn(`커뮤니티 목록 요청 검증 실패 : 잘못된 size 값 ${size}`);
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        const data = await selectCommunityList(
            community_type as string || '', // community_type이 없으면 빈 문자열
            pageNum,
            sizeNum
        );

        logger.info(`커뮤니티 목록 조회 성공 : 총 ${data.totalCount}개, 현재 페이지 ${data.list.length}개`);

        res.status(StatusCodes.OK).json({ data: data });
    } catch (err) {
        logger.error('커뮤니티 목록 조회 중 오류 발생', err);
        next(err);
    }
};