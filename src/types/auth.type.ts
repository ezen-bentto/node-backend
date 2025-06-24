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
  user_type: '1' | '2' | '3';
  approval_status?: string;
  provider?: '1' | '2' | '3' | '4' | null;
  // created_at, updated_at 등 다른 DB 컬럼이 있다면 여기에 추가
}

// JWT payload 및 req.user에 사용될 사용자 정보 (DB의 User 테이블과 매핑)
export interface AuthUser {
  id: string; // user_id (PK)
  loginId: string; // login_id (필수: 소셜ID 또는 이메일)
  email?: string; // user.email 필드 (소셜로그인 이메일 또는 별도 저장 이메일)
  nickname: string;
  profileImage?: string; // user.profile_image 필드
  provider: string;
  userType?: string;
  approvalStatus?: string;
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
