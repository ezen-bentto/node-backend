import addCntViews from './contest/addCntViews.model';
import delContest from './contest/delete.model';
import isBookmark from './contest/IsBookmark.model';
import getContestById from './contest/getContestById.model';
import getContestDetail from './contest/getDetail.model';
import modBookmark from './contest/modBookmark.model';
import modContest from './contest/modify.model';
import regBookmark from './contest/regBookmark.model';
import regContest from './contest/register.model';
import selectList from './contest/selectList.mode';
import selectContestsByCategory from './contest/selectContestsByCategory.model';
import getBookmark from './contest/getBookmarks.model';
import regCategory from './contest/regCategory.model';

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
 *        2025/06/24           김혜미             추가작성
 * @param 없음
 */
export const ContestModel = {
  regContest,
  getContestDetail,
  addCntViews,
  selectList,
  delContest,
  modContest,
  getContestById,
  regBookmark,
  isBookmark,
  getBookmark,
  modBookmark,
  selectContestsByCategory,
  regCategory,
};
