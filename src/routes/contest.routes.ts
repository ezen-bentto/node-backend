import ContestController from '@/controllers/contest.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

/**
 *
 * 공모전 관련 API 라우터 모음
 *
 * @constant router
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성
 *        2025/06/24           김혜미             추가작성
 */
const router = Router();

router.get('/getDetail', ContestController.getContestDetail);
router.get('/getList', ContestController.getContestList);
router.post('/register', ContestController.regContest);
router.post('/:id/modify', authMiddleware, ContestController.modContest);
router.post('/:id/delete', authMiddleware, ContestController.delContest);
router.post('/:target_id/bookmark', authMiddleware, ContestController.regBookmark);
router.get('/:target_id/bookmark', ContestController.getIsBookmarked);
router.get('/:target_id/bookmark/counter', ContestController.getBookmark);
router.get('/category', ContestController.getContestsByCategory);

export default router;
