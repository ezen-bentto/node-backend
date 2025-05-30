import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { client } from '@/config/redis.config';
import { getContestDetail as getDetailSchema } from '@/schemas/content.schema';
import { ContestModel } from '@/models/contest.model';

/**
 *
 * 공모전 상세 서비스
 *
 * 클라이언트로부터 전달받은 공모전 ID를 기반으로 상세 정보를 조회하며,
 * Redis를 활용해 조회수를 관리합니다.
 * 조회수는 존재하지 않는 IP일 경우에만 증가시키고,
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
export const getContestDetail = async ({ ip, id }: getDetailSchema) => {
  try {
    // 실제 공모전 상세 조회 (DB)
    const contest = await ContestModel.getContestDetail(id);

    console.log(contest);

    if (contest === undefined){
      new AppError(StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
      return;
    }

    // ip redis 조회
    const ipKey = `contest${id}:ip${ip}`;
    const data = await client.get(ipKey);

    // 만약 redis에 해당 게시글에 대하여 ip가 없을 경우
    if (data == null) {
      // redis에 해당 ip를 추가
      await client.set(ipKey, 1);
      // 유효기간을 24시간 설정
      await client.expire(ipKey, 86400);
      // 게시글 조회수 증가
      // contest.viewCount++;
      // 조회수 컬럼만 올리는 로직
    }

    return contest;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
