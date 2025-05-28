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

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: number;
      email: string;
      nickname: string;
      profileImage?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}