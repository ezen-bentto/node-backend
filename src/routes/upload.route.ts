import { regImage } from '@/controllers/regImage.controller';
import { upload } from '@/middlewares/awsUpload.middleware';
import { Router } from 'express';

const router = Router();

router.post('/image', upload.single('image'), regImage);

export default router;
