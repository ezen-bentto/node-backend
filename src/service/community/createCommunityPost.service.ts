import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { CommunityRegisterRequest } from '@/schemas/commnutiy.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

export const createCommunityPost = async (data: CommunityRegisterRequest) => {
    // TODO : session에서 userId값 꺼내기
    const userId = 5;

    try {
        const res = await CommunityModel.insertCommunity(data, userId);

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