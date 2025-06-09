import { regContest } from './contest/register.controller';
import { getContestDetail } from './contest/getDetail.controller';
import { getContestList } from './contest/getList.controller';
import { modContest } from './contest/modify.controller';
import { delContest } from './contest/delete.controller';
import { getContestDetailEdit } from './contest/getDetailEdit.controller';

/**
 *
 * 공모전 컨트롤러 모음  
 * 공모전 등록, 조회, 수정, 삭제 기능을 하나의 객체로 정리하여  
 * 라우터에서 사용할 수 있도록 export 합니다.
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

const ContestController = { getContestDetail, getContestList, regContest, modContest, delContest, getContestDetailEdit };

export default ContestController;
