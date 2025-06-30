import { getDBConnection } from "@/config/db.config";
import { getContestList } from "@/schemas/content.schema";
import { optionResult } from "@/types/db/request.type";

/**
 *
 * 공모전 리스트
 * 게시글 페이지를 불러온다.
 *
 * @function selectList
 * @date 2025/06/11
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/11          한유리             신규작성  
 * @param options
 * @returns getContestList
 */

const selectList = async (options: optionResult = {}): Promise<getContestList[]> => {
  const {
    search, 
    sortBy = 'latest',
    sortOrder = 'DESC',
    page = 1 ,
    limit = 16
  } = options;
  
  const sortOptions = {
    views: 'views',
    latest: 'start_date',
    deadline: 'end_date'
  };
  
  const sortColumn = sortOptions[sortBy];

  let sql = `SELECT c.contest_id id,
                    c.title,
                    c.organizer,
                    c.start_date,
                    c.end_date,
                    c.views,
                    f.id file_id,
                    f.file_path,
                    f.mime_type,
                    GROUP_CONCAT(cat.name) contest_tag
                FROM contest c
                JOIN contest_category cc
                  ON c.contest_id = cc.contest_id
                JOIN category cat
                  ON cc.category_id = cat.category_id
                LEFT JOIN file f
                  ON f.reference_id = c.contest_id`;

  const conditions: string[] = ['c.del_yn = "N"'];
  const values: any[] = [];

  // 제목 검색 조건
  if (search && search.trim()) {
    conditions.push('title LIKE ?');
    values.push(`%${search.trim()}%`);
  }

  // WHERE절 추가
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(' AND ')}`;
  }

  // GROUP BY
  sql += ` GROUP BY c.contest_id`;

  // ORDER BY
  sql += ` ORDER BY c.contest_id DESC, ${sortColumn} ${sortOrder === 'ASC' ? 'ASC' : 'DESC'}`;

  // 페이징
  const offset = (page-1) * limit;
  sql += ` LIMIT ? OFFSET ? `;
  values.push(limit, offset);

  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res;
};

export default selectList;