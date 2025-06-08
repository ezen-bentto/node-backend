import { getDBConnection } from "@/config/db.config";
import { CommunitySelectRequest } from "@/schemas/commnutiy.schema";
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
    content: string;
    author_id: number;
    reg_date: string;
    mod_date: string;
}

interface CommunityListResult {
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
    list: CommunityRow[];
}

export const selectCommunityList = async (
    filter: CommunitySelectRequest,
    page: number,
    size: number
): Promise<CommunityListResult> => {
    const { communityType, categoryType, ageGroup, sort } = filter;

    const offset = (page - 1) * size;
    const values: (string | number)[] = [];
    const whereClauses: string[] = [];

    // 필터 조건 구성
    whereClauses.push(`c.community_type = ?`);
    values.push(String(communityType));

    if (typeof categoryType === "number") {
        whereClauses.push(`c.category_type = ?`);
        values.push(categoryType);
    }

    if (ageGroup === "1") {
        whereClauses.push(`c.age_group = '1'`);
    } else if (ageGroup === "2") {
        whereClauses.push(`c.age_group IN ('1', '2')`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const sortMapping: Record<"1" | "2", string> = {
        "1": "c.reg_date DESC",
        "2": "c.end_date ASC",
    };
    const orderBy = sortMapping[sort as "1" | "2"] || "c.reg_date DESC";

    const listSql = `
        SELECT 
            c.community_id,
            c.community_type,
            c.category_type,
            c.contest_id,
            c.start_date,
            c.end_date,
            c.recruit_end_date,
            c.age_group,
            c.content,
            c.author_id,
            c.reg_date,
            c.mod_date
        FROM community c
        ${whereSQL}
        ORDER BY ${orderBy}
        LIMIT ?, ?
    `;

    const countSql = `
        SELECT COUNT(*) as totalCount
        FROM community c
        ${whereSQL}
    `;

    try {
        const db = getDBConnection();
        const listValues = [...values, offset, size];

        logger.info(`📌 커뮤니티 목록 쿼리 실행`);
        logger.info(`📌 WHERE절: ${whereSQL}`);
        logger.info(`📌 VALUES: ${JSON.stringify(values)}`);

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

        const [countRows] = await db.query(countSql, values);
        const totalCount = Number(countRows[0]?.totalCount || 0);

        const finalResult = {
            page,
            size,
            totalCount,
            totalPages: Math.ceil(totalCount / size),
            list: parsedList as CommunityRow[],
        };

        logger.info(`📊 목록 조회 완료: totalCount=${totalCount}, listLength=${parsedList.length}`);

        return finalResult;
    } catch (error) {
        logger.error('❌ selectCommunityList 에러 발생', error);
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
