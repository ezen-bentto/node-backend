import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { client } from '@/config/redis.config';
import { NextFunction } from 'express';
import { ContestSelectDetail } from '@/schemas/content.schema';

/**
 *
 * 공모전 상세 서비스
 *
 * 클라이언트로부터 전달받은 공모전 ID를 기반으로 상세 정보를 조회하며,
 * Redis를 활용해 조회수를 관리합니다.
 * 조회수는 존재하지 않는 ID일 경우에만 증가시키고,
 * 조회수 관련 키의 만료 시간을 설정하여 효율적인 캐싱을 지원합니다.
 * 데이터베이스와 모델 연동을 통해 상세 데이터를 반환합니다.
 *
 * @function getContestDetail
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param data 조회할 공모전의 상세 정보 요청 데이터 (ID 등)
 */
export const getContestDetail = async (data:ContestSelectDetail) => {
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
