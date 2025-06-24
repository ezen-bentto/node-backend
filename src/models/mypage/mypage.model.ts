// src/models/mypage.model.ts
import { getDBConnection } from '../../config/db.config';
import mariadb from 'mariadb';

export class MypageModel {
  async findPostsByUserId(userId: number) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const query = `
        SELECT community_id as id, title, content, reg_date as createdDate, community_type as communityType 
        FROM community 
        WHERE author_id = ? AND del_yn = 'N' 
        ORDER BY reg_date DESC;
      `;
      const rows = await conn.query(query, [userId]);
      return rows;
    } catch (error) {
      console.error('findPostsByUserId 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}