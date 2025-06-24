import { getDBConnection } from "@/config/db.config";

export const updateScrap = async (scrapId: number, yn: 'Y' | 'N', userId: number) => {
    const db = getDBConnection();
    const sql = `
    UPDATE scrap
    SET del_yn = ?, mod_date = NOW()
    WHERE scrap_id = ?
    AND user_id = ?
  `;
    const result = await db.query(sql, [yn, scrapId, userId]);
    return result;
};