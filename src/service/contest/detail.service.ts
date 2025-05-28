import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { client } from '@/config/redis.config';

export const detail = async () => {
  try {
    // 조회수 cnt
    await client.v4.set('views', 0);

    // 상세페이지 들어오면 incr
    const newValue: number = await client.incr('views');
    console.log(`total: ${newValue}`);

    // 모델 연결

    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
