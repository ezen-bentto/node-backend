import express from 'express';
import { registerMiddlewares } from '@/middlewares/index.middleware';
import { errorHandler } from '@/middlewares/error.middleware';
// import DemoRouter from '@/routes/demo.routes';
import CommunityRouter from '@/routes/community.routes';


const app = express();

// ✅ 1. 공통 미들웨어 설정
registerMiddlewares(app);

// ✅ 2. 라우터 연결
// demo
// app.use('/api/demo', DemoRouter);

// 커뮤니티
console.log("여기까지옴");

app.use('/api/community', CommunityRouter);


// ✅ 3. 에러 핸들러 등록
app.use(errorHandler);

export default app;
