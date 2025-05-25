import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Express 앱에 필요한 미들웨어를 한 번에 등록하는 함수
export const registerMiddlewares = (app: express.Application) => {
  // CORS(Cross-Origin Resource Sharing) 미들웨어를 가져온다.
  // 외부 도메인에서의 API 요청을 허용하기 위해 사용됨
  // CORS 활성화: 기본 설정으로 모든 출처(origin)에 대해 허용
  app.use(cors());

  // JSON 형태의 요청 바디(body)를 파싱할 수 있게 해줌
  app.use(express.json());

  // URL-encoded 형식의 요청 바디를 파싱함 (form 데이터 처리 시 사용)
  // extended: true면 qs 라이브러리를 사용, false면 querystring 사용
  app.use(express.urlencoded({ extended: true }));

  // 쿠키 파싱을 위한 미들웨어
  // 쿠키를 읽어서 req.cookies 객체에 넣어주는 미들웨어
  app.use(cookieParser());

  // HTTP 요청 로깅을 위한 미들웨어 (개발 환경에서 유용)
  // 요청 정보를 로그로 출력 (개발 환경에서는 'dev' 형식이 유용)
  app.use(morgan('dev'));
};
