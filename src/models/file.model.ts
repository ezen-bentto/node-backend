//node-backend\src\models\file.model.ts
import modFile from './file/modFile.model';
import regFile from './file/regFile.model';
import updateReferenceId from './file/updateReferenceId.model';
import { getDBConnection } from '@/config/db.config';

/**
 *
 * 파일 모델 모음
 *
 * @function FileModel
 * @date 2025/06/27
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/27           한유리             신규작성
 * @param 없음
 */

// reference 정보로 파일 조회
const findByReference = async (reference_id: number, reference_type: number) => {
  const conn = await getDBConnection().getConnection();
  try {
    // 가장 최근에 업로드된 파일 1개 탐색
    const sql = `
      SELECT file_path, mime_type 
      FROM file 
      WHERE reference_id = ? AND reference_type = ? AND del_yn = 'N' 
      ORDER BY id DESC LIMIT 1
    `;
    const [rows] = await conn.query(sql, [reference_id, reference_type]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    if (conn) conn.release();
  }
};

export const FileModel = {
  regFile,
  updateReferenceId,
  modFile,
  findByReference,
};
