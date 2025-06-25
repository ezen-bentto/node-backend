import { getDBConnection } from "@/config/db.config";
import { regContest as regSchema } from "@/schemas/content.schema";
import { InsertResult } from "@/types/db/response.type";

/**
 *
 * 공모전 등록 모델  
 * 전달받은 공모전 데이터를 DB에 삽입합니다.
 *
 * @function regContest
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param props - 공모전 등록에 필요한 데이터 객체 (ContestCreate 타입)
 * @returns InsertResult - 삽입 결과
 */
const regContest = async (props: regSchema): Promise<InsertResult> => {
  // DB 컬럼명 (snake_case)
  const keys = [
    "writer_id",
    "title",
    "organizer",
    "organizer_type",
    "prize",
    "start_date",
    "end_date",
    "homepage",
    "participants",
    "benefits",
    "contest_tag",
    "article"
  ];

  const values = keys.map((key) => (props as any)[key]);

  const sql = `INSERT INTO contest (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;

  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res;
};

export default regContest;