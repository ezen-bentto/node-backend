import { getDBConnection } from "@/config/db.config";
import { detailContest } from "@/schemas/content.schema";

/**
 *
 * 공모전 상세조회 수정 모델  
 * 전달받은 contestId로 게시글 상세 페이지를 불러온다.
 *
 * @function getContestById
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리             신규작성  
 * @param id
 * @returns detailContest
 */
const getContestById = async (id: number): Promise<detailContest> => {  
  const sql = `SELECT title,
                      organizer,
                      prize,
                      start_date,
                      end_date,
                      homepage,
                      participants,
                      benefits,
                      contest_tag,
                      article
                 FROM contest
                WHERE id = ?`;

  const db = getDBConnection();
  const res = await db.query(sql, id);

  return res[0];
};

export default getContestById;
