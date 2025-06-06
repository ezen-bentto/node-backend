# 청바지 프로젝트 마이그레이션

...

## 디렉토리 구조

```dos
node-backend/
│
├── src/                                 # 애플리케이션 핵심 소스코드
│   ├── config/                          # 환경 및 설정 관련
│   │   ├── app.config.ts                # Express 설정 등 앱 전역 설정
│   │   ├── aws.config.ts                # AWS 관련 설정
│   │   ├── db.config.ts                 # 데이터베이스 연결 설정
│   │   └── env.config.ts                # 환경변수 로딩 (.env 처리)
│
│   ├── constants/                       # 상수 모음
│   │   └── message.ts                   # 메시지, 코드 등 상수화
│
│   ├── controllers/                     # 요청 핸들러 (Route 별 분리)
│   │   ├── demo/
│   │   │   ├── get.controller.ts        # demo fnc1 요청 처리
│   │   │   └── post.controller.ts       # demo fnc2 요청 처리
│   │   └── demo.controller.ts           # demo 관련 컨트롤러 통합
│
│   ├── middlewares/                     # 공통 미들웨어
│   │   ├── auth.middleware.ts           # 인증 처리
│   │   ├── error.middleware.ts          # 에러 핸들링
│   │   ├── index.middleware.ts          # 미들웨어 묶음 내보내기
│   │   └── validate.middleware.ts       # 유효성 검사용 (zod 등)
│
│   ├── models/                          # DB 접근 계층 (쿼리 정의)
│   │   ├── demo/
│   │   │   ├── get.model.ts             # demo 조회 쿼리
│   │   │   └── post.model.ts            # demo 삽입 쿼리
│   │   └── demo.model.ts                # demo 관련 모델 통합
│
│   ├── routes/                          # 라우터 정의
│   │   └── demo.routes.ts               # /demo 경로에 대한 라우팅
│
│   ├── schemas/                         # Zod 스키마 정의
│   │   └── demo.schema.ts               # demo 요청/응답 스키마
│
│   ├── service/                         # 비즈니스 로직
│   │   ├── demo/
│   │   │   ├── get.service.ts           # demo 조회 로직
│   │   │   └── post.service.ts          # demo 생성 로직
│   │   └── demo.service.ts              # demo 서비스 통합
│
│   ├── types/                           # 타입 정의
│   │   └── db/
│   │       └── response.type.ts         # DB 응답 타입 (예: InsertResult)
│
│   ├── utils/                           # 유틸 함수
│   │   ├── hash.ts                      # 비밀번호 해시 유틸
│   │   └── logger.ts                    # 로깅 유틸
│
│   ├── app.ts                           # Express 앱 초기화
│   └── index.ts                         # 서버 실행 진입점
│
├── tests/                               # 테스트 코드
│   └── user.test.ts                     # 유닛/통합 테스트
│
├── scripts/                             # 배포/마이그레이션 스크립트
│   ├── deploy.sh                        # 배포 자동화 스크립트
│   └── init-db.sh                       # DB 초기화 스크립트
│
├── .env                                 # 환경 변수 파일
├── .gitignore                           # Git 무시 파일 목록
├── eslint.config.js                     # ESLint 설정
├── package.json                         # 프로젝트 메타 정보 및 의존성
├── README.md                            # 프로젝트 소개 문서
├── tsconfig.build.json                  # TypeScript 빌드 설정
├── tsconfig.json                        # TypeScript 컴파일러 설정
└── yarn.lock                            # Yarn 패키지 lock 파일
```
