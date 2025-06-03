import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { RecruitmentDetailModel } from '@/models/recruitmentDetail.model';
import { CommunityRegisterRequest } from '@/schemas/commnutiy.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

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
 * @param data(CommunityRegisterRequest)
 */
export const createCommunityPost = async (data: CommunityRegisterRequest) => {
    // TODO : session에서 userId값 꺼내기
    const userId = 5;

    try {
        const res = await CommunityModel.insertCommunity(data, userId);

        // TODO : 모집 상세 추가

        if (res.affectedRows != 1) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }

        const communityId = typeof res.insertId === 'bigint' ? Number(res.insertId) : res.insertId;


        if ((data.communityType === '1' || data.communityType === '2') && data.recruitments) {
            await RecruitmentDetailModel.insertRecruitmentDetail(communityId, data.recruitments);
        }
        return res;
    } catch (err: unknown) {
        console.log(err);
        handleDbError(err);
        throw err;
    }
};