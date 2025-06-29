// controllers/file/updateReferences.controller.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { FileService } from '@/service/file.service';

export const updateImageReferences: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fileName, newReferenceId } = req.body; // 프론트엔드 데이터에 맞게 수정

        console.log('reference_id 업데이트 요청:', { fileName, newReferenceId }); // 디버깅 로그

        if (!fileName || !newReferenceId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: '필수 파라미터가 누락되었습니다.'
            });
            return;
        }

        // 파일명으로 찾아서 reference_id 업데이트
        await FileService.updateReferenceId(fileName, newReferenceId);

        console.log('reference_id 업데이트 완료:', fileName, '→', newReferenceId);

        res.status(StatusCodes.OK).json({
            message: 'reference_id 업데이트 완료'
        });
    } catch (error) {
        console.error('reference_id 업데이트 실패:', error);
        next(error);
    }
};