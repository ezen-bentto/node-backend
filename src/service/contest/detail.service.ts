import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { client } from '@/config/redis.config';
import { NextFunction } from 'express';
import { ContestSelectDetail } from '@/schemas/content.schema';

export const detail = async (data:ContestSelectDetail) => {
  try {
    // 조회수 set
    await client.v4.set('views', 0);

    // userId 확인
    

    // 없는 Id면 incr로 조회수 증가
    const newValue: number = await client.incr('views');
    console.log(`total: ${newValue}`);

    // 만료시간 설정

    // 모델 연결

    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
