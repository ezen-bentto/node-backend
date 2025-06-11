import { getDBConnection } from "@/config/db.config";
import { CommentDeleteRequest } from "@/schemas/comment.schema";
import { DeleteResult } from "@/types/db/response.type";

// 댓글 Delete
export const deleteComment = async (props: CommentDeleteRequest, userId: number): Promise<DeleteResult> => {
    try {
        const sql = `
        UPDATE comment
        SET 
        del_yn = 'Y', 
        mod_date = NOW()
        WHERE comment_id = ? 
        AND user_id = ?
        `;

        const db = getDBConnection();
        const result = await db.query(sql, [props.commentId, userId]);

        return result;
    } catch (error) {
        console.error("댓글 삭제 실패:", error);
        throw error;
    }
};

export default deleteComment;