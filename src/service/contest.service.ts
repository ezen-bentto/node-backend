import { regContest } from './contest/register.service';
import { getContestDetail } from './contest/getDetail.service';
import { getContestList } from './contest/getList.service';
import { modContest } from './contest/modify.service';
import { delContest } from './contest/delete.service';


/**
 *
 * 공모전 서비스 모음
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
export const ContestService = { regContest, getContestDetail, getContestList, modContest, delContest };
