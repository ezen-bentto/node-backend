import { getDBConnection } from "@/config/db.config";
import { CommunityDeleteRequest } from "@/schemas/commnutiy.schema";
import { DeleteResult } from "@/types/db/response.type";

// 커뮤니티 글 Delete
export const deleteCommunity = async (props: CommunityDeleteRequest, userId: number): Promise<DeleteResult> => {
    try {
        const sql = `
        UPDATE community
        SET del_yn = 'Y', mod_date = NOW()
        WHERE community_id = ? AND author_id = ?
        `;

        const db = getDBConnection();
        const result = await db.query(sql, [props.communityId, userId]);

        return result;
    } catch (error) {
        console.error("커뮤니티 삭제 실패:", error);
        throw error;
    }
};

export default deleteCommunity;