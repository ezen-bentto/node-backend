import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { RecruitmentDetailModel } from '@/models/recruitmentDetail.model';
import { CommunityDeleteRequest } from '@/schemas/community.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';
import logger from '@/utils/common/logger';

/**
 *
 *
 * @function deleteCommunityPost
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미              신규작성  
 * @param data(CommunityDeleteRequest)
 */
export const deleteCommunityPost = async (data: CommunityDeleteRequest) => {
    // TODO : session에서 userId 값 꺼내기
    // index값은? 화면에서 넘겨받기
    const userId = 5;
    const community_id = data.communityId;

    logger.info(`커뮤니티 글 삭제 서비스 호출(userId: ${userId})`);

    try {
        const res = await CommunityModel.deleteCommunity(data, userId);

        if (res.affectedRows != 1) {
            logger.warn(`커뮤니티 글 delete 실패 : ${res.affectedRows}`);
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }
        logger.debug(`커뮤니티 글 delete 성공 : ${res.affectedRows}`);

        // 모집상세도 같이 삭제 처리(있으면 삭제 없으면 넘어감)
        if (typeof community_id === "number") {
            await RecruitmentDetailModel.deleteRecruitmentDetail(community_id);
        }

        logger.info(`커뮤니티 글 삭제 서비스 종료(userId: ${userId})`);
        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 글 삭제 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};