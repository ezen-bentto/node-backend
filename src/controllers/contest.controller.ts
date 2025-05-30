import { regContest } from './contest/register.controller';
import { getContestDetail } from './contest/getDetail.controller';
import { getContestList } from './contest/getList.controller';
import { modContest } from './contest/modify.controller';
import { delContest } from './contest/delete.controller';

/**
 *
 * 공모전 컨트롤러 모음
 *
 * @function ContestController
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리              신규작성  
 * @param 없음
 */
const ContestController = { getContestDetail, getContestList, regContest, modContest, delContest };

export default ContestController;
