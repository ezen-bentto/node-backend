import { getDBConnection } from "@/config/db.config";
import { InsertResult } from "@/types/db/response.type";

/**
 *
 * 공모전 조회수
 * 전달받은 contestId로 게시글 상세 페이지를 불러온다.
 *
 * @function regContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/01           한유리             신규작성  
 * @param veiws
 * @param id
 * @returns InsertResult - 삽입 결과
 */
const addCntViews = async (views: number, id: number): Promise<InsertResult> => {  
  const sql = `UPDATE contest SET views = ? where contest_id = ?`;
  const values = [views, id];
  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res;
};

export default addCntViews;