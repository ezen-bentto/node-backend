//node-backend\src\models\file\regFile.model.ts
import { getDBConnection } from '@/config/db.config';
import { InsertResult } from '@/types/db/response.type';

/**
 *
 * 공모전 파일 저장
 * 전달받은 refrence_id로 공모전 이미지를 등록한다.
 *
 * @function regFile
 * @date 2025/06/27
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/27           한유리             신규작성
 * @param
 * @param
 * @returns InsertResult - 삽입 결과
 */

export interface FileParams {
  reference_id: number;
  reference_type: number;
  original_name: string;
  file_path: Buffer;
  mime_type?: string;
}

const regFile = async (data: FileParams) => {
  const sql = `INSERT INTO file (reference_id, reference_type, original_name, file_path, mime_type) VALUES (?, ?, ?, ?, ?);`;

  const conn = getDBConnection();
  const result = await conn.query(sql, [
    data.reference_id,
    data.reference_type,
    data.original_name,
    data.file_path,
    data.mime_type || null,
  ]);

  // console.log("result", result)
  return result;
};

export default regFile;
