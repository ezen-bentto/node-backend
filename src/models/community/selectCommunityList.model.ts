import { getDBConnection } from "@/config/db.config";
import logger from '@/utils/common/logger';

interface CommunityRow {
    community_id: number;
    community_type: string;
    category_type: number | null;
    contest_id: number | null;
    start_date: string | null;
    end_date: string | null;
    recruit_end_date: string | null;
    age_group: string | null;
    title: string;
    content: string;
    nickname: string;
    author_id: number;
    reg_date: string;
    mod_date: string;
    scrap_count: number;
    comment_count: number;
}

interface CommunityListResult {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
    list: CommunityRow[];
}

export const selectCommunityList = async (
    communityType: string,
    page: number,
    size: number
): Promise<CommunityListResult> => {

    const offset = (page - 1) * size;
    let values: (string | number)[] = [];
    let whereClause = '';
    let countWhereClause = '';

    // communityType 조건 추가
    if (communityType) {
        whereClause = 'AND c.community_type = ?';
        countWhereClause = 'c.community_type = ?';
        values.push(communityType);
    }

    const listSql = `
        SELECT 
            c.community_id,
            c.contest_id,
            c.author_id,
            u.nickname,
            c.community_type,
            c.category_type,
            c.age_group,
            c.start_date,
            c.end_date,
            c.recruit_end_date,
            c.title,
            c.content,
            c.reg_date,
            c.mod_date,
            COUNT(DISTINCT s.scrap_id) AS scrap_count,
            COUNT(DISTINCT cm.comment_id) AS comment_count
        FROM community c
        LEFT JOIN scrap s 
            ON s.target_id = c.community_id 
            AND s.target_type = '2' 
            AND s.del_yn = 'N'
        LEFT JOIN comment cm
            ON c.community_id = cm.post_id 
            AND cm.del_yn = 'N'
        LEFT JOIN user u
            ON u.user_id = c.author_id
        WHERE c.del_yn='N'
        ${whereClause}
        GROUP BY 
            c.community_id,
            c.contest_id,
            c.author_id,
            u.nickname,
            c.community_type,
            c.category_type,
            c.age_group,
            c.start_date,
            c.end_date,
            c.recruit_end_date,
            c.title,
            c.content,
            c.reg_date,
            c.mod_date
        ORDER BY c.reg_date DESC
        LIMIT ? OFFSET ?
    `;

    // 전체 개수 조회 쿼리
    const countSql = `
        SELECT 
            COUNT(DISTINCT c.community_id) as totalCount
        FROM community c
        LEFT JOIN scrap s 
            ON s.target_id = c.community_id 
            AND s.target_type = '2' 
            AND s.del_yn = 'N'
        LEFT JOIN comment cm
            ON c.community_id = cm.post_id 
            AND cm.del_yn = 'N'
        WHERE 
            ${countWhereClause}
    `;
    logger.info("communityType:", communityType);


    try {
        const db = getDBConnection();
        const listValues = [...values, size, offset];

        const result = await db.query(listSql, listValues);
        const list = Array.isArray(result) ? result : [];

        const parsedList = list.map(row => {
            const converted: Record<string, any> = {};
            for (const key in row) {
                const value = (row as any)[key];
                converted[key] = typeof value === "bigint" ? Number(value) : value;
            }
            return converted;
        });


        const countResult = await db.query(countSql, values);
        logger.info("countResult:", countResult);

        const countRows = Array.isArray(countResult) ? countResult : [];
        const totalCount = Number(countRows[0]?.totalCount || 0);

        const finalResult = {
            page,
            size,
            totalCount,
            totalPages: Math.ceil(totalCount / size),
            list: parsedList as CommunityRow[],
        };

        logger.info(`목록 조회 완료: totalCount=${totalCount}, listLength=${parsedList.length}`);

        return finalResult;
    } catch (error) {
        logger.error('selectCommunityList 에러 발생', error);
        return {
            page,
            size,
            totalCount: 0,
            totalPages: 0,
            list: [],
        };
    }
};


export type { CommunityListResult };
export default selectCommunityList;