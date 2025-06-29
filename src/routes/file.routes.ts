import { uploadImageController } from '@/controllers/community/uploadCommunityImage.controller';
import { fileController } from '@/controllers/file.controller';

import { Router } from 'express';
import multer from 'multer';

const router = Router();

// 메모리에 버퍼 저장 -> 파일을 메모리 버퍼로 즉시 가져와 DB로 넘기기 위해
const upload = multer({ storage: multer.memoryStorage() });

// 인증이 필요한 API
router.post('/contest/image', upload.single('file'), fileController.regFile);
router.post('/community/image', upload.single('file'), uploadImageController);

router.post('/update-reference', fileController.updateImageReferences);

export default router;
