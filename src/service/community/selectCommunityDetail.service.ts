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
 *  
 * @param communityId 
 */
export const selectCommunityDetail = async (communityId: number) => {
    logger.info('커뮤니티 상세 조회 서비스 호출');
    try {
        const res = await CommunityModel.selectCommunityDetail(communityId);
        logger.info('커뮤니티 상세 조회 서비스 종료');

        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 상세 조회 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};
