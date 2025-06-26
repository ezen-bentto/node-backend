import { getDBConnection } from '@/config/db.config';
import { InsertResult } from '@/types/db/response.type';

/**
 *
 * 공모전 북마크
 * 전달받은 target_id,  user_id 로 해당 공모전 게시물은 북마크한다
 *
 * @function regBookmark
 * @date 2025/06/24
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/24           이철욱             신규작성
 * @param target_id - 스크랩 대상 ID (공모전 ID)
 * @param user_id - 사용자 ID
 * @returns InsertResult - 삽입 결과
 */
const regBookmark = async (target_id: number, user_id: number): Promise<InsertResult> => {
  const sql = `
    INSERT INTO scrap (target_id, user_id, target_type, reg_date, mod_date, del_yn)
    VALUES (?, ?, '1', NOW(), NOW(), 'N')
  `;
  const values = [target_id, user_id];
  const pool = getDBConnection();
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const res = await conn.query(sql, values);

    await conn.commit();
    console.log('북마크 INSERT 커밋 완료:', res.insertId); // 로그 추가
    return res;
  } catch (error) {
    console.error('regBookmark 에러:', error); // 로그 추가
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

export default regBookmark;
