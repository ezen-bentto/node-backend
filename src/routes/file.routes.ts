import { fileController } from '@/controllers/file.controller';
import { Router } from 'express';
import multer from 'multer';

const router = Router();

// 메모리에 버퍼 저장 -> 파일을 메모리 버퍼로 즉시 가져와 DB로 넘기기 위해
const upload = multer({ storage: multer.memoryStorage() });

// 인증이 필요한 API
router.post('/contest/image', upload.single('file'), fileController.regContestFile);
router.post('/contest/image/:id', upload.single('file'), fileController.modContestFile);

export default router;
