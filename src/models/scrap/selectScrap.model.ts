//src\models\scrap\selectScrap.model.ts
import { getDBConnection } from "@/config/db.config";

export const selectScrap = async (
    targetId: number,
    userId: number,
    targetType: string
) => {
    const db = getDBConnection();
    const sql = `
    SELECT scrap_id, del_yn
    FROM scrap
    WHERE target_id = ?
      AND user_id = ?
      AND target_type = ?
    LIMIT 1
  `;
    const result = await db.query(sql, [targetId, userId, targetType]);
    return Array.isArray(result) && result.length > 0 ? result[0] : null;
};