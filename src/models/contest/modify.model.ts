import { getDBConnection } from "@/config/db.config";
import { modContest as modContestParam} from "@/schemas/content.schema";

/**
 *
 * 공모전 수정 모델  
 * 전달받은 공모전 데이터를 DB에 수정한다.
 *
 * @function modContest
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리             신규작성  
 * @param props
 * @returns
 */
const modContest = async (contestId: number, data: Partial<modContestParam>) => {
  // 전달된 필드만 업데이트하는 동적 쿼리
  const updateFields = [];
  const values = [];

  if(data.title !== undefined){
    updateFields.push('title = ?');
    values.push(data.title);
  }
  if (data.organizer !== undefined) {
    updateFields.push('organizer = ?');
    values.push(data.organizer);
  }
  if (data.prize !== undefined) {
    updateFields.push('prize = ?');
    values.push(data.prize);
  }
  if (data.start_date !== undefined) {
    updateFields.push('start_date = ?');
    values.push(data.start_date);
  }
  if (data.end_date !== undefined) {
    updateFields.push('end_date = ?');
    values.push(data.end_date);
  }
  if (data.homepage !== undefined) {
    updateFields.push('homepage = ?');
    values.push(data.homepage);
  }
  if (data.participants !== undefined) {
    updateFields.push('participants = ?');
    values.push(data.participants);
  }
  if (data.benefits !== undefined) {
    updateFields.push('benefits = ?');
    values.push(data.benefits);
  }
  if (data.contest_tag !== undefined) {
    updateFields.push('contest_tag = ?');
    values.push(data.contest_tag);
  }
  if (data.article !== undefined) {
    updateFields.push('article = ?');
    values.push(data.article);
  }
  if (updateFields.length === 0) {
    throw new Error('수정할 데이터가 없습니다.');
  }
  values.push(contestId);

  const sql = `UPDATE contest SET ${updateFields.join(',')} WHERE id = ? `;

  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res[0];
};

export default modContest;
