import express from 'express';
import { registerMiddlewares } from '@/middlewares/index.middleware';
import { errorHandler } from '@/middlewares/error.middleware';
import DemoRouter from '@/routes/demo.routes';
import ContestRouter from '@/routes/contest.routes';
import uploadRouter from '@/routes/upload.route';

const app = express();

// ✅ 1. 공통 미들웨어 설정
registerMiddlewares(app);

// ✅ 2. 라우터 연결
app.use('/api/demo', DemoRouter);
app.use('/api/contest', ContestRouter);

app.use('/api/upload', uploadRouter);

// ✅ 3. 에러 핸들러 등록
app.use(errorHandler);

export default app;
