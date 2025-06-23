// src/types/auth.type.ts

export interface KakaoUserInfo {
  id: number;
  kakao_account: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export interface SocialUser {
  socialId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  provider: 'kakao' | 'naver' | 'google';
}

// --- DB에서 조회되는 사용자 정보의 실제 형태 ---
export interface User {
  user_id: number;
  login_id: string;
  email?: string;
  password?: string;
  nickname: string;
  profile_image?: string;
  user_type: '개인' | '기업' | '관리자'; // DB의 user_types 테이블과 조인된 값
  approval_status?: '대기' | '승인' | '반려' | '취소'; // DB의 approval_statuses 테이블과 조인된 값
  provider?: 'kakao' | 'naver' | 'google' | 'email';
  // created_at, updated_at 등 다른 DB 컬럼이 있다면 여기에 추가
}

// JWT payload 및 req.user에 사용될 사용자 정보 (DB의 User 테이블과 매핑)
export interface AuthUser {
  id: number; // user_id (PK)
  loginId: string; // login_id (필수: 소셜ID 또는 이메일)
  email?: string; // user.email 필드 (소셜로그인 이메일 또는 별도 저장 이메일)
  nickname: string;
  profileImage?: string; // user.profile_image 필드
  provider: 'kakao' | 'naver' | 'google' | 'email'; // 로그인 방식 (필수)
  userType?: '개인' | '기업' | '관리자'; // user_type.type 값
  approvalStatus?: '대기' | '승인' | '반려' | '취소'; // approval_status.status 값 (기업회원용)
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: AuthUser; // AuthUser 타입 사용
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}
