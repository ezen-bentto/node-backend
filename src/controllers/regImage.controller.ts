import { ERROR_CODES } from '@/constants/error.constant';
import { OK_UPLOAD_IMAGE } from '@/constants/message.constant';
import { DemoCreateSchema } from '@/schemas/demo.schema';
import { DemoService } from '@/service/demo.service';
import { UploadService } from '@/service/upload.service';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const regImage = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as Express.MulterS3.File;
  //  유저가 로그인 되어 있냐 확인해봐야함
  // 유효성 검사
  if (!file) {
    return next(new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.VALIDATION_FAIL));
  }

  try {
    const imageUrl = await UploadService.uploadImageToS3(file);
    console.info('이미지 업로드 성공', imageUrl);
    res.status(StatusCodes.CREATED).json({ message: OK_UPLOAD_IMAGE, url: imageUrl });
  } catch (err) {
    next(err);
  }
};
