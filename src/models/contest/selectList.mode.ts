import { getDBConnection } from "@/config/db.config";
import { getContestList } from "@/schemas/content.schema";
import { InsertResult } from "@/types/db/response.type";

/**
 *
 * 공모전 리스트
 * 게시글 페이지를 불러온다.
 *
 * @function selectList
 * @date 2025/06/05
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/015          한유리             신규작성  
 * @param 
 * @returns getContestList
 */
const selectList = async (): Promise<getContestList> => {  
  const sql = `SELECT title, img, organizer, prize, start_date, end_date, participants, benefits, contest_tag, views FROM contest`;
  const db = getDBConnection();
  const res = await db.query(sql);

  return res;
};

export default selectList;