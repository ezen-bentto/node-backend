import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as UserService from '@/service/user.service';
import { AppError } from '@/utils/AppError';

//프로필 정보(닉네임, 이메일, 이미지 경로) 업데이트 컨트롤러

export const updateProfile: RequestHandler = async (req, res, next) => {
  try {
    // req.user의 존재를 확인하고, id를 number 타입으로 변환
    if (!req.user || !req.user.id) {
      throw new AppError(StatusCodes.UNAUTHORIZED, '인증 정보가 없습니다.');
    }
    const userId = Number(req.user.id);

    const { nickname, email, profileImage } = req.body;

    const tokens = await UserService.updateProfile(userId, { nickname, email, profileImage });

    res.status(StatusCodes.OK).json({
      success: true,
      message: '프로필이 성공적으로 수정되었습니다.',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};
