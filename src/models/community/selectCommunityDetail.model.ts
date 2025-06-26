import { getDBConnection } from '@/config/db.config';
import logger from '@/utils/common/logger';

export interface RecruitmentDetail {
  recruitment_detail_id: number;
  role: string;
  count: number;
}

export interface CommunityDetail {
  community_id: number;
  community_type: string;
  category_type: number;
  contest_id: number;
  start_date: string | null;
  end_date: string | null;
  recruit_end_date: string | null;
  age_group: string;
  title: string;
  content: string;
  author_id: number;
  nickname: string;
  reg_date: string | null;
  recruitment_detail_list: RecruitmentDetail[];
  scrap_yn: boolean;
}

// BigInt → Number 변환 함수
const convertBigIntToNumber = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  } else if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === 'bigint') {
        result[key] = Number(val);
      } else if (typeof val === 'object' && val !== null) {
        result[key] = convertBigIntToNumber(val);
      } else {
        result[key] = val;
      }
    }
    return result;
  }
  return obj;
};

export const selectCommunityDetail = async (
  communityId: number,
  userId?: number
): Promise<CommunityDetail | null> => {
  const db = getDBConnection();

  const [communityRows] = await db.query(
    `SELECT 
            c.community_id,
            c.contest_id,
            c.author_id,
            u.nickname AS nickname,
            c.community_type,
            c.start_date,
            c.end_date,
            c.recruit_end_date,
            c.content,
            c.category_type,
            c.age_group,
            c.title,
            c.reg_date
        FROM community c
        JOIN user u 
        ON u.user_id = c.author_id
        WHERE c.community_id = ? AND c.del_yn = 'N'`,
    [communityId]
  );

  const rows = Array.isArray(communityRows) ? communityRows : [communityRows];

  if (!rows || rows.length === 0) {
    return null;
  }

  const community = rows[0];

  // 날짜 변환 함수
  const toISOStringSafe = (date: any): string | null =>
    date instanceof Date ? date.toISOString() : null;

  const communityWithStringDates = {
    ...community,
    start_date: toISOStringSafe(community?.start_date),
    end_date: toISOStringSafe(community?.end_date),
    recruit_end_date: toISOStringSafe(community?.recruit_end_date),
    reg_date: toISOStringSafe(community?.reg_date),
  };

  const detailQueryResult = await db.query(
    `SELECT 
            recruitment_detail_id, 
            role, 
            count 
        FROM recruitment_detail 
        WHERE community_id = ? AND del_yn = 'N'`,
    [communityId]
  );

  const detailRows = Array.isArray(detailQueryResult)
    ? Array.isArray(detailQueryResult[0])
      ? detailQueryResult[0]
      : detailQueryResult
    : [];

  const recruitment_detail_list: RecruitmentDetail[] = Array.isArray(detailRows) ? detailRows : [];

  let scrap_yn = false; // 기본값

  if (userId) {
    const scrapRows = await db.query(
      `SELECT scrap_id FROM scrap
             WHERE target_id = ? AND user_id = ? AND target_type = '2' AND del_yn = 'N'`,
      [communityId, userId]
    );

    if (Array.isArray(scrapRows) && scrapRows.length > 0) {
      logger.info('communityId', communityId);
      logger.info('userId', userId);
      logger.info('scrapRows', scrapRows);

      scrap_yn = true;
    }
  }

  const result = {
    ...communityWithStringDates,
    recruitment_detail_list,
    scrap_yn,
  };

  const resultWithConverted = convertBigIntToNumber(result);

  return resultWithConverted;
};

export default selectCommunityDetail;
