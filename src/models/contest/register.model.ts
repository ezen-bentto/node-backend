import { getDBConnection } from "@/config/db.config";
import { ContestCreate } from "@/schemas/content.schema";
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
export const regContest = async (props: ContestCreate): Promise<InsertResult> => {
  // DB 컬럼명 (snake_case)
  const keys = [
    "writer_id",
    "title",
    "img",
    "organizer",
    "prize",
    "start_date",
    "end_date",
    "homepage",
    "participants",
    "benefits",
    "contest_tag",
    "article"
  ];

  // props (camelCase) → DB 컬럼 순서에 맞춰 값 추출
  const values = [
    props.writerId,
    props.title,
    props.img,
    props.organizer,
    props.prize,
    props.startDate,
    props.endDate,
    props.homepage,
    props.participants,
    props.benefits,
    props.contest_tag,
    props.article,
  ];

  const sql = `INSERT INTO contest (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;

  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res;
};

export default regContest;
