import { getDBConnection } from "@/config/db.config";
import { CommunityRegisterRequest } from "@/schemas/community.schema";
import { InsertResult } from "@/types/db/response.type";

export const insertCommunity = async (
  props: CommunityRegisterRequest,
  userId: number
): Promise<InsertResult> => {
  const keys = [
    "community_type",
    "category_type",
    "contest_id",
    "start_date",
    "end_date",
    "recruit_end_date",
    "age_group",
    "title",
    "content",
    "author_id",
    "reg_date",
    "mod_date",
  ];

  const values = [
    props.communityType ?? null,
    props.categoryType ?? null,
    props.contestId ?? null,
    props.startDate ?? null,
    props.endDate ?? null,
    props.recruitEndDate ?? null,
    props.ageGroup ?? null,
    props.title,
    props.content,
    userId,
  ];

  try {
    const sql = `INSERT INTO community (${keys.join(", ")}) VALUES (${keys
      .map((key) => (key === "reg_date" || key === "mod_date" ? "NOW()" : "?"))
      .join(", ")})`;

    const db = getDBConnection();
    const res = await db.query(sql, values);

    console.log("INSERT 결과:", res);
    return res as InsertResult;
  } catch (error) {
    console.error("커뮤니티 글 등록 중 오류:", error);
    throw new Error("커뮤니티 글 등록 중 오류 발생");
  }
};

export default insertCommunity;
