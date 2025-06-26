import { getDBConnection } from '@/config/db.config';

const modBookmark = async (target_id: number, user_id: number, del_yn: string) => {
  const sql = `
    UPDATE scrap 
    SET del_yn = ?, mod_date = NOW() 
    WHERE target_id = ? AND user_id = ? AND target_type = '1'
  `;
  const pool = getDBConnection();
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const res = await conn.query(sql, [del_yn, target_id, user_id]);

    await conn.commit();
    return res;
  } catch (error) {
    if (conn) {
      await conn.rollback();
    }
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export default modBookmark;
