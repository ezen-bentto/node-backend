// src/config/env.config.ts
import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT as string),
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    acquireTimeout: Number(process.env.DB_ACQUIRE_TIMEOUT || 10000)
  },

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as string,
    refreshSecret: process.env.REFRESH_SECRET as string,
    refreshExpiresIn: (process.env.REFRESH_EXPIRES_IN || '7d') as string,
  },

  aws: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
  },

  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID as string,
    clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    redirectUri: process.env.KAKAO_REDIRECT_URI as string,
  },

  naver: {
    clientId: process.env.NAVER_CLIENT_ID as string,
    clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    redirectUri: process.env.NAVER_REDIRECT_URI as string,
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: process.env.GOOGLE_REDIRECT_URI as string,
  },

  corsOrigin: process.env.CORS_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info',

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
  },
};
