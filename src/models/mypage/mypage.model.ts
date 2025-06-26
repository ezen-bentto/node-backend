// src/models/mypage/mypage.model.ts
import { getDBConnection } from '../../config/db.config';
import mariadb from 'mariadb';

export class MypageModel {
  // 내가 쓴 커뮤니티 글 조회
  async findPostsByUserId(userId: number) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const query = `
      SELECT 
        community_id as id, title, content, reg_date as createdDate, 
        community_type as communityType, category_type as categoryType, 
        recruit_end_date as recruitEndDate
      FROM community 
      WHERE author_id = ? AND del_yn = 'N' 
      ORDER BY reg_date DESC;
    `;
      return await conn.query(query, [userId]);
    } catch (error) {
      console.error('findPostsByUserId 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 내가 북마크한 공모전 조회
  async findBookmarkedContestsByUserId(userId: number) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const query = `
        SELECT 
          c.contest_id as id, c.title, c.organizer, c.end_date as endDate, 
          c.participant, c.prize, c.benifits
        FROM scrap s
        JOIN contest c ON s.target_id = c.contest_id
        WHERE s.user_id = ? AND s.target_type = '1' AND s.del_yn = 'N'
        ORDER BY s.reg_date DESC;
      `;
      return await conn.query(query, [userId]);
    } catch (error) {
      console.error('findBookmarkedContestsByUserId 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }

  // 내가 북마크한 커뮤니티 글 조회
  async findBookmarkedCommunitiesByUserId(userId: number) {
    let conn: mariadb.PoolConnection | undefined;
    try {
      conn = await getDBConnection().getConnection();
      const query = `
      SELECT 
        co.community_id as id, co.title, co.content, co.reg_date as createdDate, 
        co.community_type as communityType, co.category_type as categoryType, 
        co.recruit_end_date as recruitEndDate,
        u.nickname as authorNickname 
      FROM scrap s
      JOIN community co ON s.target_id = co.community_id
      JOIN user u ON co.author_id = u.user_id
      WHERE s.user_id = ? AND s.target_type = '2' AND s.del_yn = 'N'
      ORDER BY s.reg_date DESC;
    `;
      return await conn.query(query, [userId]);
    } catch (error) {
      console.error('findBookmarkedCommunitiesByUserId 실패:', error);
      throw error;
    } finally {
      if (conn) conn.release();
    }
  }
}