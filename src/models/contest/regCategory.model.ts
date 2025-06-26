import { getDBConnection } from '@/config/db.config';
import { regContest as regSchema } from '@/schemas/content.schema';
import { InsertResult } from '@/types/db/response.type';

/**
 *
 * 공모전 등록에서 카테고리 등록
 *
 * @function regCategory
 * @date 2025/06/25
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/25           이철욱             신규작성
 * @param props - 공모전 등록에 필요한 데이터 객체 (ContestCreate 타입)
 * @returns InsertResult - 삽입 결과
 */

export interface regCategoryProps {
  contest_id: string;
  category_id: string;
}
const regCategory = async ({
  contest_id,
  category_id,
}: regCategoryProps): Promise<InsertResult> => {
  // DB 컬럼명 (snake_case)

  const values = [contest_id, category_id];

  const sql = `INSERT INTO contest_category (contest_id, category_id) VALUES (?, ?)`;
  const db = getDBConnection();
  const res = await db.query(sql, values);
  return res;
};

export default regCategory;
