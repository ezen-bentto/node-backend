// src/controllers/mypage/mypage.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MypageModel } from '../../models/mypage/mypage.model';
import { serializeBigInt } from '../../utils/common/serializeBigInt';

export class MypageController {
  private mypageModel = new MypageModel();

  // 프로필 정보는 authMiddleware에서 이미 처리했으므로 그대로 사용
  public getProfile = (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({ success: true, data: serializeBigInt(req.user)});
  };

  public getMyPosts = async (req: Request, res: Response) => {
    const userId = Number(req.user!.id);
    try {
      const posts = await this.mypageModel.findPostsByUserId(userId);
      res.status(StatusCodes.OK).json({ success: true, data: serializeBigInt(posts)});
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류' });
    }
  };

  public getBookmarkedContests = async (req: Request, res: Response) => {
    const userId = Number(req.user!.id);
    try {
      const contests = await this.mypageModel.findBookmarkedContestsByUserId(userId);
      res.status(StatusCodes.OK).json({ success: true, data: serializeBigInt(contests)});
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류' });
    }
  };

  public getBookmarkedCommunities = async (req: Request, res: Response) => {
    const userId = Number(req.user!.id);
    try {
      const communities = await this.mypageModel.findBookmarkedCommunitiesByUserId(userId);
      res.status(StatusCodes.OK).json({ success: true, data: serializeBigInt(communities)});
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: '서버 오류' });
    }
  };

  public updateProfile = async (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_IMPLEMENTED).json({ message: '아직 구현되지 않은 기능입니다.' });
  };
}