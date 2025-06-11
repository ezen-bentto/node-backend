import { getDBConnection } from "@/config/db.config";
import { getContestList } from "@/schemas/content.schema";
import { optionResult } from "@/types/db/request.type";

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
  id: number;
  author_id: number;
  title: string;
  content: string;
  recruit_end_date: string | null;
}

const selectCommunityList = async (contestId:number): Promise<CommunityList[]> => {
  const sql = `SELECT id,
                      author_id,
                      title,
                      content,
                      recruit_end_date
                 FROM community
                WHERE contest_id = ?`;

  const db = getDBConnection();
  const res = await db.query(sql, [contestId]);

  return res;
};

export default selectCommunityList;