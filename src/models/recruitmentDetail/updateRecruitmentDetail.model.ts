// updateRecruitmentDetail.model.ts 수정 버전

import { getDBConnection } from '@/config/db.config';
import logger from '@/utils/common/logger';

interface RecruitmentDetail {
    recruitmentDetailId?: number;
    role: string;
    count: number;
}

export const updateRecruitmentDetail = async (
    communityId: number,
    recruitments: RecruitmentDetail[]
): Promise<void> => {
    const db = getDBConnection();

    try {
        logger.info(`모집 상세 정보 업데이트 시작 (communityId: ${communityId})`);
        logger.info(`받은 recruitments 데이터:`, JSON.stringify(recruitments, null, 2));

        // 1. 기존 모집 정보 조회
        const existingQuery = `
            SELECT recruitment_detail_id 
            FROM recruitment_detail 
            WHERE community_id = ? AND del_yn = 'N'
        `;

        const existingResult = await db.query(existingQuery, [communityId]);
        logger.info(`기존 쿼리 결과 타입:`, typeof existingResult);
        logger.info(`기존 쿼리 결과:`, existingResult);

        // 쿼리 결과 안전하게 처리
        let existingRows: any[] = [];
        if (Array.isArray(existingResult)) {
            // [rows, fields] 형태인 경우
            if (existingResult.length > 0 && Array.isArray(existingResult[0])) {
                existingRows = existingResult[0];
            } else {
                existingRows = existingResult;
            }
        }

        logger.info(`처리된 기존 rows:`, existingRows);

        const existingIds = existingRows.map((row: any) => {
            // BigInt를 Number로 변환
            const id = typeof row.recruitment_detail_id === 'bigint'
                ? Number(row.recruitment_detail_id)
                : row.recruitment_detail_id;
            return id;
        });

        logger.info(`기존 ID들:`, existingIds);

        // 2. 현재 요청에 포함된 기존 ID들 수집
        const currentIds = recruitments
            .filter(r => r.recruitmentDetailId !== undefined && r.recruitmentDetailId !== null)
            .map(r => r.recruitmentDetailId);

        logger.info(`현재 요청 ID들:`, currentIds);

        // 3. 삭제할 ID들 (기존에 있었지만 현재 요청에 없는 것들)
        const idsToDelete = existingIds.filter(id => !currentIds.includes(id));
        logger.info(`삭제할 ID들:`, idsToDelete);

        // 4. 삭제 처리 (soft delete)
        if (idsToDelete.length > 0) {
            const deleteQuery = `
                UPDATE recruitment_detail 
                SET del_yn = 'Y', mod_date = NOW() 
                WHERE recruitment_detail_id IN (${idsToDelete.map(() => '?').join(',')}) 
                AND community_id = ?
            `;

            const deleteParams = [...idsToDelete, communityId];
            await db.query(deleteQuery, deleteParams);
            logger.info(`삭제된 모집 정보 ID: ${idsToDelete.join(', ')}`);
        }

        // 5. 추가/수정 처리
        for (const r of recruitments) {
            if (r.recruitmentDetailId && r.recruitmentDetailId > 0) {
                // 기존 항목 수정
                const updateQuery = `
                    UPDATE recruitment_detail 
                    SET role = ?, count = ?, mod_date = NOW() 
                    WHERE recruitment_detail_id = ? AND community_id = ? AND del_yn = 'N'
                `;

                const updateResult = await db.query(updateQuery, [
                    r.role,
                    r.count,
                    r.recruitmentDetailId,
                    communityId
                ]);

                logger.info(`수정 쿼리 결과:`, updateResult);
                logger.info(`수정된 모집 정보 ID: ${r.recruitmentDetailId}`);
            } else {
                // 새 항목 추가
                const insertQuery = `
                    INSERT INTO recruitment_detail (community_id, role, count, reg_date, mod_date, del_yn)
                    VALUES (?, ?, ?, NOW(), NOW(), 'N')
                `;

                const insertResult = await db.query(insertQuery, [
                    communityId,
                    r.role,
                    r.count
                ]);

                logger.info(`추가 쿼리 결과:`, insertResult);
                logger.info(`새로 추가된 모집 정보`);
            }
        }

        logger.info(`모집 상세 정보 업데이트 완료 (communityId: ${communityId})`);

    } catch (error) {
        logger.error('모집 상세 정보 업데이트 중 상세 오류:', {
            error: error,
            stack: error instanceof Error ? error.stack : 'No stack trace',
            communityId,
            recruitments
        });
        throw error;
    }
};

export type { RecruitmentDetail };
export default updateRecruitmentDetail;