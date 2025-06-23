import CommonController from '@/controllers/common.controller';

import { Router } from 'express';

const router = Router();

router.get('/getCategory', CommonController.getCategory);



export default router;