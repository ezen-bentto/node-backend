import { CommunityModel } from '@/models/community.model';
import { handleDbError } from '@/utils/handleDbError';

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
 * @param communityId   상세 조회할 커뮤니티 ID
 */
export const selectCommunityDetail = async (communityId: number) => {
    try {
        const res = await CommunityModel.selectCommunityDetail(communityId);
        return res;
    } catch (err: unknown) {
        handleDbError(err);
        throw err;
    }
};
