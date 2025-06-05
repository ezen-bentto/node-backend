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

    // 🚀 디버깅 시작
    console.log('🚀 selectCommunityList 호출됨');
    console.log('📝 필터 파라미터:', JSON.stringify(filter, null, 2));
    console.log('📝 페이징:', { page, size });
    console.log('📝 communityType 타입:', typeof communityType, '값:', communityType);

    const offset = (page - 1) * size;
    const values: (string | number)[] = [];
    const whereClauses: string[] = [];

    // 문자열 타입
    whereClauses.push(`c.community_type = ?`);
    values.push(String(communityType));

    // 숫자 타입
    if (typeof categoryType === "number") {
        whereClauses.push(`c.category_type = ?`);
        values.push(categoryType);
    } else if (categoryType === null) {
        whereClauses.push(`c.category_type IS NULL`);
    }

    // 문자열 하드코딩
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

    // 🔍 쿼리 정보 출력
    console.log('📊 최종 WHERE절:', whereSQL);
    console.log('📊 WHERE 파라미터:', JSON.stringify(values));
    console.log('📊 LIST 쿼리:\n', listSql);
    console.log('📊 COUNT 쿼리:\n', countSql);

    try {
        const db = getDBConnection();
        const listValues = [...values, offset, size];

        console.log('📊 최종 LIST 파라미터:', JSON.stringify(listValues));

        // 🔍 EXPLAIN으로 실행 계획 확인
        const explainSql = `EXPLAIN ${listSql}`;
        console.log('🔍 EXPLAIN 쿼리 실행 시작...');
        const explainStartTime = Date.now();

        try {
            const explainResult = await db.query(explainSql, listValues);
            console.log('📈 EXPLAIN 결과:', JSON.stringify(explainResult, null, 2));
            console.log('⏱️ EXPLAIN 실행시간:', Date.now() - explainStartTime, 'ms');
        } catch (explainError) {
            console.log('❌ EXPLAIN 실행 오류:', explainError);
        }

        // 🔍 실제 데이터 쿼리 실행
        console.log('🔍 LIST 쿼리 실행 시작...');
        const listStartTime = Date.now();
        const result = await db.query(listSql, listValues);
        const listEndTime = Date.now();
        console.log('⏱️ LIST 쿼리 실행시간:', listEndTime - listStartTime, 'ms');

        const list = Array.isArray(result) ? result : [];
        console.log('📦 조회된 데이터 개수:', list.length);

        if (list.length > 0) {
            console.log('📋 첫 번째 데이터:', JSON.stringify(list[0], null, 2));
        } else {
            console.log('⚠️ 조회된 데이터가 없습니다!');
        }

        // ✅ BigInt → Number 변환 처리
        const parsedList = list.map(row => {
            const converted: Record<string, any> = {};
            for (const key in row) {
                const value = (row as any)[key];
                converted[key] = typeof value === "bigint" ? Number(value) : value;
            }
            return converted;
        });

        // 🔍 COUNT 쿼리 실행
        console.log('🔍 COUNT 쿼리 실행 시작...');
        const countStartTime = Date.now();
        const [countRows] = await db.query(countSql, values);
        const countEndTime = Date.now();
        console.log('⏱️ COUNT 쿼리 실행시간:', countEndTime - countStartTime, 'ms');

        const totalCount = Number(countRows[0]?.totalCount || 0);
        console.log('📊 전체 데이터 개수:', totalCount);

        logger.debug(`최종 whereSQL: ${whereSQL}`);
        logger.debug(`최종 values: ${JSON.stringify(values)}`);

        const finalResult = {
            page,
            size,
            totalCount,
            totalPages: Math.ceil(totalCount / size),
            list: parsedList as CommunityRow[],
        };

        console.log('✅ selectCommunityList 완료:', {
            page: finalResult.page,
            size: finalResult.size,
            totalCount: finalResult.totalCount,
            totalPages: finalResult.totalPages,
            listLength: finalResult.list.length
        });

        return finalResult;
    } catch (error) {
        console.log('❌ selectCommunityList 에러 발생:', error);
        console.log('❌ 에러 상세:', JSON.stringify(error, null, 2));

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