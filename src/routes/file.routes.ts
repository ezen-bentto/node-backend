//node-backend\src\routes\file.routes.ts
import { uploadImageController } from '@/controllers/community/uploadCommunityImage.controller';
import { fileController } from '@/controllers/file.controller';
import { authMiddleware } from '@/middlewares/auth.middleware'; // 인증 미들웨어 import

import { Router } from 'express';
import multer from 'multer';

const router = Router();

// 메모리에 버퍼 저장 -> 파일을 메모리 버퍼로 즉시 가져와 DB로 넘기기 위해
const upload = multer({ storage: multer.memoryStorage() });

// API는 인증으로 authMiddleware 추가
// :type 파라미터를 사용하여 동적으로 파일 업로드를 처리하는 라우트
// 예: /api/file/contest/image, /api/file/profile/image
router.post('/:type/image', authMiddleware, upload.single('file'), fileController.regFile);
router.post('/:type/image/:id', authMiddleware, upload.single('file'), fileController.modFile);

// 커뮤니티 전용 이미지 업로드 라우트 (기존 코드 유지)
router.post('/community/image', authMiddleware, upload.single('file'), uploadImageController);

// reference_id 업데이트 라우트
router.post('/update-reference', authMiddleware, fileController.updateImageReferences);

// DB에 저장된 파일을 직접 보여주는 GET 라우트
router.get('/view/:reference_type/:reference_id', fileController.viewFile);

export default router;
