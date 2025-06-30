//node-backend\src\models\file\updateReferenceId.model.ts
import { getDBConnection } from '@/config/db.config';

const updateReferenceId = async (fileName: string, referenceId: number) => {
    const sql = `
        UPDATE file 
        SET reference_id = ? 
        WHERE original_name = ? 
        AND reference_id IN (-999, -1)
        AND id = (
            SELECT MAX(id) FROM (
                SELECT id FROM file 
                WHERE original_name = ? AND reference_id IN (-999, -1)
            ) as temp
        )
    `;

    try {
        console.log('업데이트 쿼리 (최신만):', { fileName, referenceId });

        const db = getDBConnection();
        const result = await db.query(sql, [referenceId, fileName, fileName]);

        console.log('쿼리 결과 - 업데이트된 행 수:', result.affectedRows);

        return result;
    } catch (error) {
        console.error('reference_id 업데이트 중 오류:', error);
        throw error;
    }
};

export default updateReferenceId;