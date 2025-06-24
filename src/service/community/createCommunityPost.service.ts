import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { RecruitmentDetailModel } from '@/models/recruitmentDetail.model';
import { CommunityRegisterRequest } from '@/schemas/community.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 *
 * @function createCommunityPost
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미               신규작성  
 *        2025/06/24           김혜미               userId 파라미터화
 * @param data(CommunityRegisterRequest)
 * @param userId 작성자 ID
 */
export const createCommunityPost = async (data: CommunityRegisterRequest, userId: number) => {
    logger.info(`커뮤니티 글 등록 서비스 호출(userId: ${userId})`);
    try {
        const res = await CommunityModel.insertCommunity(data, userId);

        if (res.affectedRows != 1) {
            logger.warn(`커뮤니티 글 insert 실패 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }
        logger.debug(`커뮤니티 글 insert 성공 : ${res.insertId}`);

        const communityId = typeof res.insertId === 'bigint' ? Number(res.insertId) : res.insertId;

        if ((data.communityType === '1' || data.communityType === '2') && data.recruitments) {
            logger.info(`모집 상세 등록 시작 : ${communityId}`);
            await RecruitmentDetailModel.insertRecruitmentDetail(communityId, data.recruitments);
            logger.info(`모집 상세 등록 완료 : ${communityId}`);
        }

        logger.info(`커뮤니티 글 등록 서비스 종료(userId: ${userId})`);
        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 글 등록 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};
