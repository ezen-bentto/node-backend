import { getDBConnection } from '@/config/db.config';

const isBookmark = async (target_id: number, user_id: number) => {
  const sql = `
    SELECT *
    FROM scrap 
    WHERE target_id = ? AND user_id = ? AND target_type = '1'
  `;
  const pool = getDBConnection();
  let conn;

  try {
    conn = await pool.getConnection();
    const res = await conn.query(sql, [target_id, user_id]);
    return res[0]; // 없으면 undefined 반환
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export default isBookmark;
