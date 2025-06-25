import { getDBConnection } from "@/config/db.config";
import { contestListItem } from "@/schemas/content.schema";

/**
 *
 * 카테고리별 진행중인 공모전 목록 조회
 * 특정 분야에 해당하는 현재 진행중인 공모전의 ID와 제목을 반환
 *
 * @function selectContestsByCategory
 * @date 2025/06/24
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/24          김혜미             신규작성  
 * @param categoryId
 */

export const selectContestsByCategory = async (categoryId: number): Promise<contestListItem[]> => {
  let sql = `SELECT 
               c.contest_id,
               c.title
             FROM contest c
             INNER JOIN contest_category cc ON c.contest_id = cc.contest_id
             WHERE cc.category_id = ?
               AND c.end_date >= CURDATE()
               AND c.del_yn = 'N'
             ORDER BY c.title ASC`;

  const values = [categoryId];

  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res;
};

export default selectContestsByCategory;