import { regContest } from './contest/register.service';
import { getContestDetail } from './contest/getDetail.service';
import { getContestList } from './contest/getList.service';
import { modContest } from './contest/modify.service';
import { delContest } from './contest/delete.service';
import { getContestById } from './contest/getContestById.service';


/**
 *
 * 공모전 서비스 모음
 *
 * 본 모듈은 공모전 관련 주요 비즈니스 로직을 수행하는 서비스 함수들을
 * 하나로 묶어 관리합니다. 등록, 상세 조회, 목록 조회, 수정, 삭제 기능을 포함하며,
 * 각 기능별 서비스 파일에서 구현된 함수들을 통합하여 제공합니다.
 *
 * @function ContestService
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리              신규작성  
 * @param 없음
 */
export const ContestService = { regContest, getContestDetail, getContestList, modContest, delContest, getContestById };
