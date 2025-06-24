import { ENV } from './env.config';

export const googleConfig = {
  clientId: ENV.google.clientId,
  clientSecret: ENV.google.clientSecret,
  redirectUri: ENV.google.redirectUri,
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
};