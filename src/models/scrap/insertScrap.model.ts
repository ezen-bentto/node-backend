import { getDBConnection } from "@/config/db.config";

export const insertScrap = async (
    targetId: number,
    userId: number,
    targetType: string
) => {
    const db = getDBConnection();
    const sql = `
    INSERT INTO scrap (target_id, user_id, target_type, reg_date, mod_date, del_yn)
    VALUES (?, ?, ?, NOW(), NOW(), 'N')
  `;
    const result = await db.query(sql, [targetId, userId, targetType]);
    return result;
};

