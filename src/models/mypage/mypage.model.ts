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
    const CRAWLING_ID_THRESHOLD = 240; // 크롤링 데이터와 DB 데이터를 나누는 기준 ID

    try {
      conn = await getDBConnection().getConnection();

      // 1. 북마크한 모든 공모전 ID 가져오기 (변경 없음)
      const allScrappedQuery = `
        SELECT target_id FROM scrap
        WHERE user_id = ? AND target_type = '1' AND del_yn = 'N'
        ORDER BY reg_date DESC;
      `;
      const scrappedItems: { target_id: number }[] = await conn.query(allScrappedQuery, [userId]);
      const allTargetIds = scrappedItems.map(item => item.target_id);

      if (allTargetIds.length === 0) {
        return { crawledContestIds: [], dbContests: [] };
      }

      // 2. 크롤링 ID와 DB ID 분리 (변경 없음)
      const crawledContestIds: number[] = [];
      const dbContestIds: number[] = [];

      allTargetIds.forEach(id => {
        if (id <= CRAWLING_ID_THRESHOLD) {
          crawledContestIds.push(id);
        } else {
          dbContestIds.push(id);
        }
      });

      // 3. DB ID에 해당하는 공모전 정보 조회
      let dbContests = [];
      if (dbContestIds.length > 0) {
        // [수정된 부분] SQL 쿼리 수정
        const dbQuery = `
          SELECT 
            c.contest_id as id, 
            c.title, 
            c.organizer, 
            c.end_date as endDate,
            c.organizer_type,
            c.participants,
            cc.category_id
          FROM contest c
          LEFT JOIN contest_category cc ON c.contest_id = cc.contest_id
          WHERE c.contest_id IN (?)
          GROUP BY c.contest_id;
        `;

        const results = await conn.query(dbQuery, [dbContestIds]);

        // DB에서 가져온 결과를 원래의 ID 순서(최신순)에 맞게 정렬 (변경 없음)
        dbContests = dbContestIds
          .map(id => results.find((contest: any) => contest.id === id))
          .filter(Boolean);
      }

      // 4. 최종 데이터 반환 (변경 없음)
      return { crawledContestIds, dbContests };
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
      WHERE s.user_id = ? AND s.target_type = '2' AND s.del_yn = 'N' AND co.del_yn = 'N'
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
