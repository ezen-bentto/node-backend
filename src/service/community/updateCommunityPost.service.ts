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
 *
 * @function updateCommunityPost
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미               신규작성 
 *  
 * @param data    CommunityUpdateRequest
 */
export const updateCommunityPost = async (data: CommunityUpdateRequest) => {
    // TODO : session에서 userId값 꺼내기
    // 글번호는? 화면에서 넘겨준다
    const userId = 5;
    const communityId = 20;

    logger.info(`커뮤니티 글 수정 서비스 호출(userId: ${userId})`);
    try {
        const res = await CommunityModel.updateCommunity(data, communityId, userId);

        if (res.affectedRows != 1) {
            logger.warn(`커뮤니티 글 update 실패 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }
        logger.debug(`커뮤니티 글 update 성공 : ${res.affectedRows}`);

        if (data.recruitments && data.recruitments.length > 0) {
            logger.info(`모집 상세 수정 시작 : ${communityId}`);
            await RecruitmentDetailModel.updateRecruitmentDetail(communityId, data.recruitments);
            logger.info(`모집 상세 수정 종료 : ${communityId}`);
        }

        logger.info(`커뮤니티 글 수정 서비스 종료(userId: ${userId})`);
        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 글 수정 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};