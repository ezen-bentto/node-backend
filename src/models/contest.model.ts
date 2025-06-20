import addCntViews from "./contest/addCntViews.model";
import delContest from "./contest/delete.model";
import getContestById from "./contest/getContestById.model";
import getContestDetail from "./contest/getDetail.model";
import modContest from "./contest/modify.model";
import regContest from "./contest/register.model";
import selectList from "./contest/selectList.mode";

/**
 *
 * 공모전 모델 모음  
 * 공모전 관련 DB 모델 함수들을 하나로 묶어 export 합니다.
 *
 * @function ContestModel
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param 없음
 */
export const ContestModel = {regContest, getContestDetail, addCntViews, selectList, delContest, modContest, getContestById };