import { getDBConnection } from '@/config/db.config';

interface FileRecord {
    reference_id: number;
    reference_type: number;
    original_name: string;
    save_name: string;
    file_path: string;
    mime_type: string;
}

export const insertFileRecord = async (fileData: FileRecord) => {
    const sql = `
    INSERT INTO file (
      reference_id, 
      reference_type, 
      original_name, 
      save_name, 
      file_path, 
      mime_type, 
      reg_date, 
      mod_date
    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

    const values = [
        fileData.reference_id,
        fileData.reference_type,
        fileData.original_name,
        fileData.save_name,
        fileData.file_path,
        fileData.mime_type,
    ];

    try {
        const db = getDBConnection();
        const result = await db.query(sql, values);
        return result;
    } catch (error) {
        console.error('파일 정보 저장 중 오류:', error);
        throw new Error('파일 정보 저장 중 오류 발생');
    }
};