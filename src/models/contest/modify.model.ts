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
const modContest = async (props: modContestParam) => {
  const values = [
    props.writer_id,
    props.title,
    props.img,
    props.organizer,
    props.prize,
    props.start_date,
    props.end_date,
    props.homepage,
    props.participants,
    props.benefits,
    props.contest_tag,
    props.article,
    props.id
  ]

  const sql = `UPDATE contest SET writer_id = ?, title = ?, img = ?, organizer = ?,
  prize = ?, start_date = ?, end_date = ?, homepage = ?, participants = ?, benefits = ?,
  contest_tag = ?, article = ? WHERE id = ?`;;

  const db = getDBConnection();
  const res = await db.query(sql, values);

  return res[0];
};

export default modContest;
