import { CommunitySelectRequest } from '@/schemas/commnutiy.schema';
import { selectCommunityList } from '@/service/community/selectCommunityList.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * ```
 * 패키지명: controllers/community
 * 상세설명: 커뮤니티 목록 조회 컨트롤러
 * ```
 *
 * @date 2025/06/03
 * @author 김혜미
 */

export const getCommunityList = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const parsed = CommunitySelectRequest.safeParse(req.query);

        if (!parsed.success) {
            res.status(400).json({
                message: '잘못된 요청 파라미터입니다.',
                errors: parsed.error.format(),
            });
            return;
        }

        const { page = '1', size = '10' } = req.query;

        const result = await selectCommunityList(
            parsed.data,
            parseInt(page as string, 10),
            parseInt(size as string, 10)
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};