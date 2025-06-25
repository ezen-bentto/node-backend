import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { handleDbError } from '@/utils/handleDbError';
import { detailContest, getDetailParam } from '@/schemas/content.schema';
import { ContestModel } from '@/models/contest.model';
import trackViewByIp from '@/utils/common/trackViewByIp';
import selectCommunityList, {
  CommunityList,
} from '@/models/community/selectCommunityByContestId.model';
import { formatDateOnly } from '@/utils/common/dateFormat';

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
 *        2025/06/09           이철욱             조회수 로직 공통 함수로 분리
 * @param data 조회할 공모전의 상세 정보 요청 데이터 (ID 등)
 */

export interface ContestDetailWithCommunity extends detailContest {
  communityList: CommunityList[];
}

const getContestDetail = async ({
  ip,
  id,
}: getDetailParam): Promise<ContestDetailWithCommunity> => {
  try {
    // 공모전 상세 조회
    const contestData = await ContestModel.getContestDetail(id);

    if (contestData === undefined) {
      new AppError(StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    // 조회수 증가 (IP 기준)
    await trackViewByIp('contest', id, ip, contestData.views);

    // 팀원 모집 리스트 조회
    const communityList = await selectCommunityList(id);

    return {
      ...contestData,
      start_date: formatDateOnly(contestData.start_date) || '',
      end_date: formatDateOnly(contestData.end_date) || '',
      communityList,
    };
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};

export default getContestDetail;
