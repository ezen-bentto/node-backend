// middlewares/verifyWriter.ts
import getContestById from '@/service/contest/getContestById.service';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const verifyContestWriter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contestId = Number(req.params.id);

    const user = req.user;
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: '인증이 필요합니다.' });
      return;
    }

    const userId = Number(user.id);

    const contest = await getContestById({ id: contestId });
    if (!contest) {
      res.status(StatusCodes.NOT_FOUND).json({ message: '공모전을 찾을 수 없습니다.' });
      return;
    }

    const writerId = Number(contest.writer_id);

    // 지금 유저가 관리자계정인지 확인
    const isAdmin = [1, 2, 3, 4, 5].includes(userId);

    if (writerId !== userId || !isAdmin) {
      res.status(StatusCodes.FORBIDDEN).json({ message: '수정 권한이 없습니다.' });
      return;
    }

    console.log('뭐임?? 안되는거임???');

    next();
  } catch (err) {
    console.error('작성자 검증 중 에러:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: '서버 에러' });
    return;
  }
};
