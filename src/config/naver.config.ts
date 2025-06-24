import { ENV } from './env.config';

export const naverConfig = {
  clientId: ENV.naver.clientId,
  clientSecret: ENV.naver.clientSecret,
  redirectUri: ENV.naver.redirectUri,
  tokenUrl: 'https://nid.naver.com/oauth2.0/token',
  userInfoUrl: 'https://openapi.naver.com/v1/nid/me',
};