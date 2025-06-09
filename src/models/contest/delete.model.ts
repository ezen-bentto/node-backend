import { getDBConnection } from "@/config/db.config";
import { delContest as delContestParam } from "@/schemas/content.schema";

/**
 *
 * 공모전 삭제제 모델  
 * 전달받은 contestId로 게시글을 삭제한한다.
 *
 * @function delContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param id
 * @returns
 */
const delContest = async (id: number): Promise<delContestParam> => {  
  const sql = `UPDATE contest SET del_yn = 1 WHERE id = ?`;

  const db = getDBConnection();
  const res = await db.query(sql, id);

  return res[0];
};

export default delContest;
