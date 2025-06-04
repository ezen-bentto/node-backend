import { getDBConnection } from '@/config/db.config';

interface RecruitmentDetail {
    recruitmentDetailId?: number;
    role: string;
    count: number;
}

export const updateRecruitmentDetail = async (
    communityId: number,
    recruitments: RecruitmentDetail[]
): Promise<void> => {
    const db = getDBConnection();

    for (const r of recruitments) {

        if (r.recruitmentDetailId) {
            // 수정
            await db.query(
                `UPDATE recruitment_detail SET role = ?, count = ?, mod_date = NOW() WHERE recruitment_detail_id = ? AND community_id = ?`,
                [r.role, r.count, r.recruitmentDetailId, communityId]
            );
        } else {
            // 새로 추가
            await db.query(
                `INSERT INTO recruitment_detail (community_id, role, count, reg_date, mod_date, del_yn)
         VALUES (?, ?, ?, NOW(), NOW(), 'N')`,
                [communityId, r.role, r.count]
            );
        }
    }
};

export type { RecruitmentDetail };
export default updateRecruitmentDetail;