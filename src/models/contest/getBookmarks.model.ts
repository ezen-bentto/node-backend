import { getDBConnection } from '@/config/db.config';

const getBookmark = async (target_id: number) => {
  const sql = `
    SELECT COUNT(*) as cnt
    FROM scrap 
    WHERE target_id = ? AND del_yn = "Y" AND target_type = '1'
  `;
  const db = getDBConnection();
  const res = await db.query(sql, target_id);
  return res[0]; // 없으면 undefined 반환
};

export default getBookmark;
