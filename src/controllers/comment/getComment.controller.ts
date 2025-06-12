import { selectComment } from '@/service/comment/selectComment.service';
import { Request, Response, NextFunction } from 'express';
import logger from '@/utils/common/logger';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { serializeBigInt } from '@/utils/common/serializeBigInt';

/**
 * ```
 * 패키지명: controllers/comment
 * 상세설명: 댓글 목록 조회 컨트롤러
 * ```
 *
 * @date 2025/06/10
 * @author 김혜미
 */

export const getComment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        logger.info(`댓글 목록 요청 시작 : ${req.ip}`);

        // 쿼리 파라미터에서 값 추출
        // community_id 추출 후 number로 변환
        const postId = Number(req.query.postId);

        const data = await selectComment(postId);

        logger.info("댓글 목록 조회 성공");
        const serializedData = serializeBigInt(data);
        res.status(StatusCodes.OK).json({ data: serializedData });
    } catch (err) {
        logger.error('댓글 목록 조회 중 오류 발생', err);
        next(err);
    }
};