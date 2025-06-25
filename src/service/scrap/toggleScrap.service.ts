//node-backend\src\service\scrap\toggleScrap.service.ts
import { ScrapModel } from '@/models/scrap.model';
import logger from '@/utils/common/logger';

export const toggleScrap = async (
    targetId: number,
    userId: number,
    targetType: string
) => {
    logger.info(`스크랩 서비스 호출 (userId: ${userId}, targetId: ${targetId}, targetType: ${targetType})`);

    const existing = await ScrapModel.selectScrap(targetId, userId, targetType);

    if (!existing) {
        logger.info(`스크랩 등록: targetId=${targetId}, userId=${userId}`);
        const insertRes = await ScrapModel.insertScrap(targetId, userId, targetType);
        return { scrapped: true, scrapId: insertRes.insertId };
    }

    if (existing.del_yn === 'Y') {
        logger.info(`스크랩 복원: scrapId=${existing.scrap_id}`);
        await ScrapModel.updateScrap(existing.scrap_id, 'N', userId);
        return { scrapped: true, scrapId: existing.scrap_id };
    }

    logger.info(`스크랩 해제: scrapId=${existing.scrap_id}`);
    await ScrapModel.updateScrap(existing.scrap_id, 'Y', userId);
    return { scrapped: false, scrapId: existing.scrap_id };
};
