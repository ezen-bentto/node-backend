import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { ENV } from '@/config/env.config';


// Express 앱에 필요한 미들웨어를 한 번에 등록하는 함수
export const registerMiddlewares = (app: express.Application) => {
  // CORS(Cross-Origin Resource Sharing) 미들웨어를 가져온다.
  // 외부 도메인에서의 API 요청을 허용하기 위해 사용됨
  // CORS 활성화: 기본 설정으로 모든 출처(origin)에 대해 허용
  app.use(cors({
    origin: ENV.corsOrigin,           // 프론트엔드 URL (React 앱이 5173번 포트에서 실행 중) -- env 파일에서 가져오기
    methods: ['GET', 'POST'],         // 허용할 HTTP 메소드
    //allowedHeaders: ['Cache-Control', 'no-cache, no-store, must-revalidate']  // 허용할 헤더
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control']


  }
  ));

  // 프록시 서버(Nginx, Cloudflare 등)를 통과한 요청에서 클라이언트의 실제 IP를 가져오기 위해 필요
  // trust proxy를 활성화하면 Express가 X-Forwarded-For 헤더를 신뢰하고 req.ip 값을 정확히 설정함
  app.set('trust proxy', true);

  // no-cache: 요청이 있을 때마다 서버에 새로운 데이터를 요청하도록 강제
  // no-store: 서버에서 받은 데이터를 브라우저가 저장하지 않도록 함함
  // must-revalidate: 리소스가 만료되었을 경우, 다시 요청을 보내기 전에 서버에 유효성을 검증하도록 강제

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
