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

// zod 만들거니까 필요 없음
export interface FileDTO {
  reference_id: number;
  reference_type: number;
  original_name: string;
  file_path: Buffer;
}

const regFile = async (fileData:FileDTO ) => {
  const sql = `INSERT INTO file (reference_id, reference_type, original_name, file_path) VALUES (?, ?, ?, ?);`;

  const conn = getDBConnection();
  const [result] = await conn.query(sql, [fileData.reference_id, fileData.reference_type, fileData.original_name, fileData.file_path]);

  return result;
};

export default regFile;
