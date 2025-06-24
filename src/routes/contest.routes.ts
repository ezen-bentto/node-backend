import ContestController from '@/controllers/contest.controller';
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
 */
const router = Router();

router.get('/getDetail', ContestController.getContestDetail);
router.get('/getList', ContestController.getContestList);
router.post('/register', ContestController.regContest);
router.get('/modify', ContestController.getContestById);
router.post('/modify', ContestController.modContest);
router.post('/delete', ContestController.delContest);
router.post('/bookmark', ContestController.regBookmark);

export default router;
