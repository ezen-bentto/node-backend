import { ERROR_CODES } from '@/constants/error.constant';
import { CommunityModel } from '@/models/community.model';
import { CommunityDeleteRequest } from '@/schemas/commnutiy.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

export const deleteCommunityPost = async (data: CommunityDeleteRequest) => {
    // TODO : session에서 userId 값 꺼내기
    // index값은?
    const userId = 5;

    try {

        const res = await CommunityModel.deleteCommunity(data, userId);

        if (res.affectedRows != 1) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.INSERT_FAIL);
        }
        return res;
    } catch (err: unknown) {
        handleDbError(err);
        throw err;
    }
};