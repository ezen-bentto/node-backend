import CommunityController from '@/controllers/community.controller';

import { Router } from 'express';

const router = Router();

router.post('/register', CommunityController.regCommunityPost);
router.post('/modify', CommunityController.modCommunityPost);
router.post('/delete', CommunityController.delCommunityPost);


export default router;