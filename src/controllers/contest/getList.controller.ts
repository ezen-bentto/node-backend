import { ContestService } from '@/service/contest.service';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { optionResult } from "@/types/db/request.type";

/**
 * 공모전 목록 조회 핸들러
 *
 * 전체 공모전 목록 데이터를 조회하여 클라이언트에 반환합니다.
 * 향후 페이징 또는 필터링 기능이 추가될 수 있습니다.
 *
 * @function getContestList
 * @date 2025/05/30
 * @author 한유리
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *        2025/05/30           한유리             신규작성
 *
 * @param {Request} req - 요청 객체
 * @param {Response} res - 응답 객체 (공모전 목록 데이터 반환)
 * @param {NextFunction} next - 에러 처리용 next 함수
 */

export const getContestList: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {search, sortBy, sortOrder, page, limit} = req.query;
    
    const options: optionResult = {};
    if (search && typeof search === 'string') {
      options.search = search;
    }
    
    if (sortBy && (sortBy === 'views' || sortBy === 'latest' || sortBy === 'deadline')) {
      options.sortBy = sortBy;
    }
    
    if (sortOrder && (sortOrder === 'ASC' || sortOrder === 'DESC')) {
      options.sortOrder = sortOrder;
    }

    if (page && typeof page === 'string') {
      const pageNum = parseInt(page, 10);
      if (pageNum > 0) {
        options.page = pageNum;
      }
    }

    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit, 10);
      if (limitNum > 0) {
        options.limit = limitNum;
      }
    }

    const data = await ContestService.getContestList(options);

    for(let i=0; i<data.length; i++){
      data[i].views = data[i].views.toString();
      data[i].id = data[i].id.toString();
    }
    
    res.status(StatusCodes.OK).json({ data: data, pagination: {currentPage: options.page, limit: options.limit }});
    return;
  } catch (err) {
    next(err);
  }
};
