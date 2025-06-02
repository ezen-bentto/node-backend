import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { CommunityUpdateRequest } from '@/schemas/commnutiy.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

export const updateCommunityPost = async (data: CommunityUpdateRequest) => {
    // TODO : session에서 userId값 꺼내기
    // 글번호는?
    const userId = 5;
    const communityId = 2;

    try {
        const res = await CommunityModel.updateCommunity(data, communityId, userId);

        // TODO : 모집 상세 추가


        if (res.affectedRows != 1) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }
        return res;
    } catch (err: unknown) {
        handleDbError(err);
        throw err;
    }
};