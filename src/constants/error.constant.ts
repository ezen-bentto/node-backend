// E001 ~ E099	입력값 유효성, 인증 관련 오류 (클라이언트 잘못)
// E100 ~ E199	비즈니스 로직 오류 (예: 중복, 없는 값, 상태 문제 등)
// E500 ~ E599	DB 및 시스템 관련 오류 (예: DB 에러, 연결 문제 등)
// E900 ~ E999	기타 서버 오류 (예: 알 수 없는 내부 에러 등)

export const ERROR_CODES = {
  // ✅ Validation & Auth Errors (E001 ~ E099)
  VALIDATION_FAIL: 'E001', // 유효성 검사 실패
  UNAUTHORIZED: 'E002', // 인증 실패
  FORBIDDEN: 'E003', // 권한 없음
  TOKEN_EXPIRED: 'E004', // 토큰 만료

  // ✅ Business Logic Errors (E100 ~ E199)
  DUPLICATE_EMAIL: 'E100', // 이메일 중복
  DUPLICATE_ENTRY: 'E101', // DB에서 unique 제약 위반
  NOT_FOUND: 'E102', // 리소스 없음
  INSERT_FAIL: 'E103', // 삽입 실패
  UPDATE_FAIL: 'E104', // 수정 실패
  DELETE_FAIL: 'E105', // 삭제 실패
  ALREADY_EXISTS: 'E106', // 이미 존재함 (기타용)
  INVALID_STATE: 'E107', // 현재 상태에서 처리 불가

  // ✅ DB or System Errors (E500 ~ E599)
  DB_ERROR: 'E500', // DB 에러 (기타)
  DB_CONNECTION_ERROR: 'E501', // DB 연결 문제
  TRANSACTION_ERROR: 'E502', // 트랜잭션 실패

  // ✅ Unknown/Internal Errors (E900 ~ E999)
  INTERNAL_ERROR: 'E999', // 알 수 없는 내부 에러
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
