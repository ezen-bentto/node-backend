import { getDBConnection } from "@/config/db.config";

export interface RecruitmentDetail {
    role: string;
    count: number;
}

export const insertRecruitmentDetail = async (
    communityId: number,
    recruitments: RecruitmentDetail[]
): Promise<void> => {
    if (!recruitments || recruitments.length === 0) return;

    const db = getDBConnection();

    const sql = `
    INSERT INTO recruitment_detail (
      community_id,
      role,
      count,
      reg_date,
      mod_date,
      del_yn
    ) VALUES ${recruitments.map(() => `(?, ?, ?, NOW(), NOW(), ?)`).join(', ')}
  `;

    const values = recruitments.flatMap(r => [
        communityId,
        r.role,
        r.count,
        'N',
    ]);

    await db.query(sql, values);
};

export default insertRecruitmentDetail;
