// src/controllers/mypage/mypage.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MypageModel } from '../../models/mypage/mypage.model';

export class MypageController {
  private mypageModel = new MypageModel();

  public getProfile = (req: Request, res: Response) => {
    // authMiddleware가 req.user에 이미 사용자 정보를 넣어줬습니다.
    res.status(StatusCodes.OK).json({ success: true, data: req.user });
  };

  public getMyPosts = async (req: Request, res: Response) => {
    const userId = req.user!.id; // authMiddleware가 보장
    try {
      const posts = await this.mypageModel.findPostsByUserId(userId);
      res.status(StatusCodes.OK).json({ success: true, data: posts });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류' });
    }
  };

  public updateProfile = async (req: Request, res: Response) => {
    // 지금은 이 기능을 구현하지 않습니다. (시간 부족)
    res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: '아직 구현되지 않은 기능입니다.' });
  };
}