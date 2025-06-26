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
    console.log('UPDATE 결과:', res); // 추가 - affectedRows 확인

    await conn.commit();
    console.log('커밋 완료'); // 추가
    return res;
  } catch (error) {
    if (conn) {
      await conn.rollback();
    }
    console.log('뭐가 문제임?', error);
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
};

export default modBookmark;
