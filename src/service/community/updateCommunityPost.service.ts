import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { RecruitmentDetailModel } from '@/models/recruitmentDetail.model';
import { CommunityUpdateRequest } from '@/schemas/community.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 * @function updateCommunityPost
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미               신규작성 
 *        2025/06/24           김혜미               userId 파라미터 추가
 *  
 * @param data    CommunityUpdateRequest
 * @param userId  로그인 사용자 ID
 */
export const updateCommunityPost = async (
    data: CommunityUpdateRequest,
    userId: number,
) => {
    logger.info(`커뮤니티 글 수정 서비스 호출(userId: ${userId})`);
    try {
        const { communityId } = data;

        // DB update 시 userId, communityId 기반으로 권한 검증 포함
        const res = await CommunityModel.updateCommunity(data, userId);

        if (res.affectedRows != 1) {
            logger.warn(`커뮤니티 글 update 실패 또는 권한 없음 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.FORBIDDEN, ERROR_CODES.FORBIDDEN);
        }
        logger.debug(`커뮤니티 글 update 성공 : ${res.affectedRows}`);

        if (data.recruitments && data.recruitments.length > 0) {
            logger.info(`모집 상세 수정 시작`);
            await RecruitmentDetailModel.updateRecruitmentDetail(communityId, data.recruitments);
            logger.info(`모집 상세 수정 종료 `);
        }

        logger.info(`커뮤니티 글 수정 서비스 종료(userId: ${userId})`);
        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 글 수정 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};
