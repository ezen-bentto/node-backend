import express from "express";
import { registerMiddlewares } from "@/middlewares/index.middleware";
import { notFoundHandler } from "@/middlewares/error.middleware";
import DemoRouter from "@/routes/demo.routes";

const app = express();

// ✅ 1. 공통 미들웨어 설정
registerMiddlewares(app);

// ✅ 2. 라우터 연결
app.use("api/demo", DemoRouter);
// app.use("api/demo", DemoRouter); 어떤 라우터

// ✅ 3. 에러 핸들러 등록
app.use(notFoundHandler); // 404 핸들러
// app.use(errorHandler);            // 에러 핸들러

export default app;
