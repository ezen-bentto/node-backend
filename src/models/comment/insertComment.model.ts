import { getDBConnection } from "@/config/db.config";
import { CommentRegisterRequest } from "@/schemas/comment.schema";
import { InsertResult } from "@/types/db/response.type";

export const insertComment = async (
  props: CommentRegisterRequest,
  postId: number,
  userId: number
): Promise<InsertResult> => {
  const keys = [
    "post_id",
    "user_id",
    "content",
    "reg_date",
    "mod_date",
  ];

  const values = [
    postId,
    userId,
    props.content,
  ];

  try {
    const sql = `INSERT INTO comment (${keys.join(", ")}) VALUES (${keys
      .map((key) => (key === "reg_date" || key === "mod_date" ? "NOW()" : "?"))
      .join(", ")})`;

    const db = getDBConnection();
    const res = await db.query(sql, values);

    return res as InsertResult;
  } catch (error) {
    console.error("댓글 등록 중 오류:", error);
    throw new Error("댓글 등록 중 오류 발생");
  }
};

export default insertComment;
