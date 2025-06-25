import { getDBConnection } from '@/config/db.config';

export const getBookmark = async (target_id: number, user_id: number) => {
  const sql = `
    SELECT del_yn 
    FROM scrap 
    WHERE target_id = ? AND user_id = ? AND target_type = '1'
    LIMIT 1
  `;
  const db = getDBConnection();
  const res = await db.query(sql, [target_id, user_id]);
  return res[0]; // 없으면 undefined 반환
};
