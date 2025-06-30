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

export interface NaverUserInfo {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email: string;
    nickname: string;
    profile_image: string;
  };
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
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
  phone?: string;
  nickname: string;
  profile_image?: string;
  user_type: '1' | '2' | '3'; // '1' 개인, '2' 기업, '3' 관리자
  approval_status?: '1' | '2' | '3' | null; // '1' 대기, '2' 승인, '3' 거절
  provider?: '1' | '2' | '3' | '4' | null; //'1' 카카오, '2' 네이버, '3' 구글, '4' 이메일
  reg_date: string;
  mod_date: string;
}

// JWT payload 및 req.user에 사용될 사용자 정보 (DB의 User 테이블과 매핑)
export interface AuthUser {
  id: string; // user_id (PK)
  loginId: string; // login_id (필수: 소셜ID 또는 이메일)
  email?: string; // user.email 필드 (소셜로그인 이메일 또는 별도 저장 이메일)
  nickname: string;
  profileImage?: string; // user.profile_image 필드
  provider: 'kakao' | 'naver' | 'google' | 'email';
  userType?: '개인' | '기업' | '관리자';
  approvalStatus?: '대기' | '승인' | '거절';
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

export interface UpdateProfileData {
  nickname?: string;
  email?: string;
  profileImage?: string;
}
