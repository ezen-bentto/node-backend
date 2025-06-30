//node-backend\src\models\file\modFile.model.ts
import { getDBConnection } from '@/config/db.config';
import { InsertResult } from '@/types/db/response.type';

/**
 *
 * 공모전 파일 수정
 * 전달받은 refrence_id로 공모전 이미지를 수정한다.
 *
 * @function modFile
 * @date 2025/06/29
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/29           한유리             신규작성
 * @param FileParams
 * @returns
 */

export interface FileParams {
  id: number;
  reference_id: number;
  original_name: string;
  file_path: Buffer;
  mime_type?: string;
}

const modFile = async ( data:FileParams ) => {
  const sql = `UPDATE file SET reference_id = ?, original_name = ?, file_path = ? , mime_type = ?, mod_date = NOW() WHERE id = ?`;

  const conn = getDBConnection();
  const result = await conn.query(sql, [data.reference_id, data.original_name, data.file_path, data.mime_type || null, data.id]);

  console.log("result", result)
  return result;
};

export default modFile;
