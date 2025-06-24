import { getDBConnection } from '@/config/db.config';

export const modBookmark = async (target_id: number, user_id: number, del_yn: string) => {
  const sql = `
    UPDATE scrap 
    SET del_yn = ?, mod_date = NOW() 
    WHERE target_id = ? AND user_id = ? AND target_type = '1'
  `;
  const db = getDBConnection();
  const res = await db.query(sql, [del_yn, target_id, user_id]);
  return res;
};
