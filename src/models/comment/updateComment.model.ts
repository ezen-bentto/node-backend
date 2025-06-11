import { getDBConnection } from "@/config/db.config";
import { CommentUpdateRequest } from "@/schemas/comment.schema";
import { UpdateResult } from "@/types/db/response.type";

export const updateComment = async (
    props: CommentUpdateRequest,
    commentId: number,
    userId: number
): Promise<UpdateResult> => {
    try {
        const sql = `
        UPDATE comment
        SET
        content = ?,
        mod_date = NOW()
        WHERE comment_id = ? 
        AND user_id = ? 
        AND del_yn = 'N'
    `;

        const values = [
            props.content,
            commentId,
            userId
        ];

        const db = getDBConnection();
        const result = await db.query(sql, values);
        return result;
    } catch (error) {
        console.error("댓글 수정 실패:", error);
        throw error;
    }
};
