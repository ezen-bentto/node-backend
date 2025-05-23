import DemoController from '@/controllers/demo.controller';
import { Router } from 'express';

const router = Router();

router.get('/', DemoController.get);
router.post('/', DemoController.post);

export default router;
