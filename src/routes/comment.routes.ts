import CommentController from '@/controllers/comment.controller';

import { Router } from 'express';

const router = Router();

router.post('/register', CommentController.regComment);
router.post('/modify', CommentController.modComment);
router.post('/delete', CommentController.delComment);
router.get('/getList', CommentController.getComment);

export default router;