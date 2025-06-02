import { getDBConnection } from "@/config/db.config";
import { detailContest, regContest } from "@/schemas/content.schema";

/**
 *
 * 공모전 상세조회 모델  
 * 전달받은 contestId로 게시글 상세 페이지를 불러온다.
 *
 * @function regContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param id
 * @returns InsertResult - 삽입 결과
 */
const getContestDetail = async (id: number): Promise<detailContest> => {  
  const sql = `SELECT * FROM contest WHERE id = ?`;

  const db = getDBConnection();
  const res = await db.query(sql, id);

  return res[0];
};

export default getContestDetail;
