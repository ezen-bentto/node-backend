import { getDBConnection } from "@/config/db.config";
import { ContestCreate } from "@/schemas/content.schema";
import { InsertResult } from "@/types/db/response.type";

export const create = async (props: ContestCreate): Promise<InsertResult> => {
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

export default create;
