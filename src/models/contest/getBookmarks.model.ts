import { getDBConnection } from '@/config/db.config';

const getBookmark = async (target_id: number) => {
  const sql = `
    SELECT COUNT(*) as cnt
    FROM scrap 
    WHERE target_id = ? AND del_yn = "N" AND target_type = '1'
  `;
  const pool = getDBConnection();
  let conn;

  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, target_id);
    return res[0]; // 없으면 undefined 반환
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export default getBookmark;
