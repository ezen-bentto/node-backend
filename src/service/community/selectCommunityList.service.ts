import { CommunityModel } from '@/models/community.model';
import { CommunitySelectRequest } from '@/schemas/commnutiy.schema';
import { handleDbError } from '@/utils/handleDbError';


/**
 *
 *
 * @function selectCommunityList
 * @date 2025/06/03
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/03           김혜미               신규작성 
 *  
 * @param data    커뮤니티 필터링 조건들 (CommunitySelectRequest)
 * @param page    현재 페이지 번호
 * @param size    페이지 당 항목 수
 */
export const selectCommunityList = async (
    data: CommunitySelectRequest,
    page: number,
    size: number
) => {
    try {
        const res = await CommunityModel.selectCommunityList(data, page, size);
        return res;
    } catch (err: unknown) {
        handleDbError(err);
        throw err;
    }
};