import { uploadImageController } from '@/controllers/community/uploadCommunityImage.controller';
import { fileController } from '@/controllers/file.controller';
import { authMiddleware } from '@/middlewares/auth.middleware'; // 인증 미들웨어 import

import { Router } from 'express';
import multer from 'multer';

const router = Router();

// 메모리에 버퍼 저장 -> 파일을 메모리 버퍼로 즉시 가져와 DB로 넘기기 위해
const upload = multer({ storage: multer.memoryStorage() });

// --- API는 인증으로 authMiddleware 추가 필요 : 예시 router.post('/community/image', authMiddleware, upload.single('file'), uploadImageController);
router.post('/contest/image', upload.single('file'), fileController.regFile);
router.post('/contest/image/:id', upload.single('file'), fileController.modFile);
router.post('/community/image', upload.single('file'), uploadImageController);
router.post('/update-reference', fileController.updateImageReferences);
router.post('/profile/image', upload.single('file'), fileController.regFile);

export default router;
