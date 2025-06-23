import { getDBConnection } from "@/config/db.config";
import { modContest as modContestParam} from "@/schemas/content.schema";
import { InsertResult } from "@/types/db/response.type";

/**
 *
 * 공모전 수정 모델  
 * 전달받은 공모전 데이터를 DB에 수정한다.
 *
 * @function modContest
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리             신규작성  
 * @param contestId
 * @param data
 * @returns
 */
const modContest = async (contestId: number, data: Partial<modContestParam>): Promise<InsertResult> => {
 const db = getDBConnection();

  const allowedFields = [
    "title",
    "organizer",
    "prize",
    "start_date",
    "end_date",
    "homepage",
    "participants",
    "benefits",
    "contest_tag",
    "article",
  ] as const;

  // 필드별 동적 구성
  const updateFields: string[] = [];
  const values: any[] = [];

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updateFields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }

  if (updateFields.length === 0) {
    throw new Error("수정할 데이터가 없습니다.");
  }

  const sql = `UPDATE contest SET ${updateFields.join(", ")} WHERE id = ?`;
  values.push(contestId);

  const result = await db.query(sql, values);
  return result;
};

export default modContest;
