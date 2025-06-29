import { NextFunction, Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { insertFileRecord } from '@/service/community/uploadCommunityImage.service';
import { AppError } from '@/utils/AppError';
import { ERROR_CODES } from '@/constants/error.constant';
import logger from '@/utils/common/logger';
import path from 'path';
import { FileService } from '@/service/file.service';
import fs from 'fs/promises'; // fs import 추가


/**
 * 커뮤니티 이미지 업로드 컨트롤러
 */
export const uploadImageController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // multer로 파일 추출
        const file = req.file;
        if (!file) {
            next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
            return;
        }

        // buildFormData에서 보내는 필드들
        const { id, article } = req.body; // article = fileName

        // 파일 확장자 및 고유명 생성
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const uniqueFileName = `file-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;

        // 저장 경로 설정
        const uploadDir = path.join(process.cwd(), 'uploads/community/images');
        const filePath = path.join(uploadDir, uniqueFileName);
        const dbFilePath = `/uploads/community/images/${uniqueFileName}`;

        // 디렉토리 생성 (없으면)
        await fs.mkdir(uploadDir, { recursive: true });

        // 메모리 버퍼를 파일로 저장
        await fs.writeFile(filePath, file.buffer);

        console.log('파일 저장 완료:', filePath);

        // 기존 FileService 활용하여 DB에 저장
        await FileService.regFile({
            reference_id: Number(id) || -1,
            reference_type: 2, // community
            original_name: article || file.originalname, // article 필드 활용
            file_path: Buffer.from(dbFilePath), // 파일 경로를 Buffer로 변환
            mime_type: file.mimetype,
        });

        // 파일 URL 생성 (기존 uploadImage 응답 형태에 맞춤)
        const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
        const fileUrl = `${baseUrl}${dbFilePath}`;

        console.log('생성된 파일 URL:', fileUrl);

        // 기존 uploadImage 응답 형태와 동일하게
        res.status(StatusCodes.OK).json({
            fileUrl
        });
        return;

    } catch (err) {
        console.error('이미지 업로드 실패:', err);
        next(err);
    }
};
