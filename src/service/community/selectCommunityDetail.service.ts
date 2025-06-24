import { CommunityModel } from '@/models/community.model';
import { handleDbError } from '@/utils/handleDbError';
import logger from '@/utils/common/logger';

/**
 *
 * @function selectCommunityDetail
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미               신규작성 
 *        2025/06/25           김혜미               userId 전달 추가
 *  
 * @param communityId 
 * @param userId (optional) 로그인 사용자 ID
 */
export const selectCommunityDetail = async (communityId: number, userId?: number) => {
    logger.info(`커뮤니티 상세 조회 서비스 호출 communityId=${communityId}, userId=${userId}`);
    try {
        const res = await CommunityModel.selectCommunityDetail(communityId, userId);
        logger.info('커뮤니티 상세 조회 서비스 종료');

        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 상세 조회 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};
