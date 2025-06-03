import { getDBConnection } from "@/config/db.config";

export interface RecruitmentDetail {
    recruitment_detail_id: number;
    role: string;
    count: number;
}

export interface CommunityDetail {
    community_id: number;
    community_type: string;
    category_type: number;
    contest_id: number;
    start_date: string;
    end_date: string;
    recruit_end_date: string;
    age_group: string;
    content: string;
    author_id: number;
    reg_date: string;
    mod_date: string;
    recruitment_detail_list: RecruitmentDetail[];
}

// BigInt → Number 변환 함수
const convertBigIntToNumber = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToNumber);
    } else if (obj && typeof obj === "object") {
        const result: any = {};
        for (const key in obj) {
            const val = obj[key];
            if (typeof val === "bigint") {
                result[key] = Number(val);
            } else if (typeof val === "object" && val !== null) {
                result[key] = convertBigIntToNumber(val);
            } else {
                result[key] = val;
            }
        }
        return result;
    }
    return obj;
};

export const selectCommunityDetail = async (
    communityId: number
): Promise<CommunityDetail | null> => {
    const db = getDBConnection();

    const [communityRows] = await db.query(
        `SELECT * FROM community WHERE community_id = ? AND del_yn = 'N'`,
        [communityId]
    );

    const rows = Array.isArray(communityRows) ? communityRows : [communityRows];

    if (!rows || rows.length === 0) {
        return null;
    }

    const community = rows[0];

    // 날짜 필드 명시적 ISO 문자열 변환
    const communityWithStringDates = {
        ...community,
        start_date: community.start_date?.toISOString(),
        end_date: community.end_date?.toISOString(),
        recruit_end_date: community.recruit_end_date?.toISOString(),
        reg_date: community.reg_date?.toISOString(),
        mod_date: community.mod_date?.toISOString(),
    };

    const detailQueryResult = await db.query(
        `SELECT recruitment_detail_id, role, count FROM recruitment_detail WHERE community_id = ? AND del_yn = 'N'`,
        [communityId]
    );

    const detailRows = Array.isArray(detailQueryResult)
        ? Array.isArray(detailQueryResult[0])
            ? detailQueryResult[0]
            : detailQueryResult
        : [];

    const recruitment_detail_list: RecruitmentDetail[] = Array.isArray(detailRows)
        ? detailRows
        : [];

    const result = {
        ...communityWithStringDates,
        recruitment_detail_list,
    };

    const resultWithConverted = convertBigIntToNumber(result);

    return resultWithConverted;
};

export default selectCommunityDetail;
