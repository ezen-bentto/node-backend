import { getDBConnection } from "@/config/db.config";
import { formatDateOnly } from "@/utils/common/dateFormat";

/**
 * 
 *
 * @function selectCommunityList
 * @date 2025/06/11
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/11          한유리             신규작성  
 * @param contestId
 * @returns selectCommunityList
 */

export interface CommunityList {
  id: string;
  author_id: string;
  title: string;
  content: string;
  recruit_end_date: string | null;
}

const selectCommunityList = async (contestId:number): Promise<CommunityList[]> => {
  const sql = `SELECT community_id,
                      author_id,
                      title,
                      content,
                      recruit_end_date
                 FROM community
                WHERE contest_id = ?`;

  const db = getDBConnection();
  const res = await db.query(sql, [contestId]);

  const parsed = res.map((row: any) => ({
    id: row.community_id.toString(),
    author_id: row.author_id.toString(),
    title: row.title,
    content: row.content,
    recruit_end_date: formatDateOnly(row.recruit_end_date),
  }));

  return parsed;
};

export default selectCommunityList;