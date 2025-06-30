import express from 'express';
import { registerMiddlewares } from '@/middlewares/index.middleware';
import { errorHandler } from '@/middlewares/error.middleware';
import { syncViewsToDb } from './jobs/syncviews.job';
import DemoRouter from '@/routes/demo.routes';
import ContestRouter from '@/routes/contest.routes';
import CommunityRouter from '@/routes/community.routes';
import { authRouter } from './routes/auth.routes';
import CommonRouter from '@/routes/common.routes';
import CommentRouter from '@/routes/comment.routes';
import ScrapRouter from '@/routes/scrap.routes';
import { mypageRouter } from '@/routes/mypage.routes';
import fileRouter from '@/routes/file.routes';
import path from 'path';


const app = express();

// ✅ 1. 공통 미들웨어 설정
registerMiddlewares(app);

// 정적 파일 서빙 설정
const staticUploadPath = process.env.UPLOAD_PATH
  ? process.env.UPLOAD_PATH
  : path.join(process.cwd(), 'uploads');

app.use('/uploads', express.static(staticUploadPath));

// ✅ 2. 라우터 연결
app.use('/api/demo', DemoRouter);
app.use('/api/contest', ContestRouter);
app.use('/api/community', CommunityRouter);
app.use('/api/auth', authRouter);
app.use('/api/comment', CommentRouter);
app.use('/api/common', CommonRouter);
app.use('/api/scrap', ScrapRouter);
app.use('/api/mypage', mypageRouter);
app.use('/api/file', fileRouter);

// 레디스 값 DB에 삽입
setInterval(
  () => {
    console.log('조회수 동기화 시작');
    syncViewsToDb('contest');
    // syncViewsToDb("community");
    // syncViewsToDb("policy");
  },
  1000 * 60 * 1
);

// ✅ 3. 에러 핸들러 등록
app.use(errorHandler);

export default app;
