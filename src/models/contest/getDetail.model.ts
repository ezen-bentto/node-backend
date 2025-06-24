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
 * @returns detailContest
 */
const getContestDetail = async (id: number): Promise<detailContest> => {  
  const sql = `SELECT c.contest_id id,
                      c.writer_id,
                      c.title,
                      c.article,
                      c.benefits,
                      c.homepage,
                      c.organizer,
                      c.organizer_type,
                      c.participants,
                      c.prize,
                      c.start_date,
                      c.end_date,
                      c.views,
                      GROUP_CONCAT(cat.name) contest_tag
                 FROM contest c
                 JOIN contest_category cc
                   ON c.contest_id = cc.contest_id
                 JOIN category cat
                   ON cc.category_id = cat.category_id
                WHERE c.contest_id = ?`;

  const db = getDBConnection();
  const res = await db.query(sql, id);

  return res[0];
};

export default getContestDetail;
