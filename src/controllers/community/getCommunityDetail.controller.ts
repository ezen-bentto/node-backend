import { CommunityService } from '@/service/community.service';
import { Request, Response, NextFunction } from 'express';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 상세 조회 컨트롤러
 * ```
 *
 * @date 2025/06/03
 * @author 김혜미
 */

export const getCommunityDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const communityId = Number(req.query.communityId);

        if (isNaN(communityId) || communityId <= 0) {
            res.status(400).json({ message: '유효하지 않은 communityId입니다.' });
            return;
        }

        const result = await CommunityService.selectCommunityDetail(communityId);

        if (!result) {
            res.status(404).json({ message: '해당 커뮤니티 글을 찾을 수 없습니다.' });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
