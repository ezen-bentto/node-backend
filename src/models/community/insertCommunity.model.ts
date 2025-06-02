import { getDBConnection } from "@/config/db.config";
import { CommunityRegisterRequest } from "@/schemas/commnutiy.schema";
import { InsertResult } from "@/types/db/response.type";

// model = mapper.xml
// 커뮤니티 글 Insert
export const insertCommunity = async (props: CommunityRegisterRequest, userId: number): Promise<InsertResult> => {
  // DB 컬럼명 (snake_case)
  const keys = [
    "community_type",
    "category_type",
    "contest_id",
    "start_date",
    "end_date",
    "recruit_end_date",
    "content",
    "author_id",
    "reg_date",
    "mod_date",
  ];

  // props (camelCase) → DB 컬럼 순서에 맞춰 값 추출
  const values = [
    props.communityType,
    props.categoryType,
    props.contestId,
    props.startDate,
    props.endDate,
    props.recruitEndDate,
    props.content,
    userId,
  ];

  let res = null;
  try {
    const sql = `INSERT INTO community (${keys.join(", ")}) VALUES (${keys
      .map((key) => (key === "reg_date" || key === "mod_date" ? "NOW()" : "?"))
      .join(", ")})`;

    const db = getDBConnection();
    res = await db.query(sql, values);
    console.log('INSERT 결과:', res);
  } catch (error) {
    console.log(error);
  }

  return res;
};

export default insertCommunity;