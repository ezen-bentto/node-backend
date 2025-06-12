import { getDBConnection } from "@/config/db.config";
import logger from "@/utils/common/logger";

interface CommentRow {
  comment_id: number;
  post_id: number;
  user_id: number;
  nickname: string;
  content: string;
  reg_date: string;
  del_yn: string;
}

interface CommentResult {
  list: CommentRow[];
}

export const selectComment = async (postId: number): Promise<CommentResult> => {
  const listSql = `
    SELECT 
      c.comment_id,
      c.post_id,
      c.user_id,
      u.nickname,
      c.content,
      c.reg_date,
      c.del_yn
    FROM comment c
    LEFT JOIN user u
      ON u.user_id = c.user_id
    WHERE c.post_id = ?
    ORDER BY c.comment_id ASC
  `;

  try {

    const db = getDBConnection();
    const result = await db.query(listSql, [postId]);
    const list = Array.isArray(result) ? result : [];


    logger.info("댓글 목록 조회 완료");

    return {
      list: list as CommentRow[],
    };
  } catch (error) {
    logger.error(`selectComment 에러 발생 (post_id: ${postId})`, error);
    return { list: [] };
  }
};

export type { CommentResult };
export default selectComment;
