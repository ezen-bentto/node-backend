import { getDBConnection } from "@/config/db.config";
import { CommunityUpdateRequest } from "@/schemas/community.schema";
import { UpdateResult } from "@/types/db/response.type";

export const updateCommunity = async (
    props: CommunityUpdateRequest,
    userId: number
): Promise<UpdateResult> => {
    try {
        const sql = `
        UPDATE community
        SET
        contest_id = ?,
        category_type = ?,
        start_date = ?,
        end_date = ?,
        recruit_end_date = ?,
        age_group = ?,
        title = ?,
        content = ?,
        mod_date = NOW()
        WHERE community_id = ? AND author_id = ? AND del_yn = 'N'
    `;

        const values = [
            props.contestId,
            props.categoryType,
            props.startDate,
            props.endDate,
            props.recruitEndDate,
            props.ageGroup,
            props.title,
            props.content,
            props.communityId,
            userId
        ];

        const db = getDBConnection();
        const result = await db.query(sql, values);
        return result;
    } catch (error) {
        console.error("커뮤니티 수정 실패:", error);
        throw error;
    }
};
