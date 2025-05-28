import { ENV } from './env.config';

export const kakaoConfig = {
  clientId: ENV.kakao.clientId,
  clientSecret: ENV.kakao.clientSecret,
  redirectUri: ENV.kakao.redirectUri,
  tokenUrl: 'https://kauth.kakao.com/oauth/token',
  userInfoUrl: 'https://kapi.kakao.com/v2/user/me',
};