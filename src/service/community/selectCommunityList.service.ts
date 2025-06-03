import { CommunityModel } from '@/models/community.model';
import { CommunitySelectRequest } from '@/schemas/commnutiy.schema';
import { handleDbError } from '@/utils/handleDbError';
import logger from '@/utils/common/logger';

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
 * @param data    CommunitySelectRequest
 * @param page    현재 페이지 번호
 * @param size    페이지 당 항목 수
 */
export const selectCommunityList = async (
    data: CommunitySelectRequest,
    page: number,
    size: number
) => {
    logger.info('커뮤니티 목록 서비스 호출');
    try {
        const res = await CommunityModel.selectCommunityList(data, page, size);
        logger.info('커뮤니티 목록 서비스 종료');

        return res;
    } catch (err: unknown) {
        logger.error('커뮤니티 목록 서비스 오류 발생', err);
        handleDbError(err);
        throw err;
    }
};