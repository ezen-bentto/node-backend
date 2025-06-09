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
    timezone: 'Asia/Seoul',
  },

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },

  aws: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    bucket: process.env.AWS_S3_BUCKET_NAME!,
  },

  corsOrigin: process.env.CORS_ORIGIN || '*',
  logLevel: process.env.LOG_LEVEL || 'info',

  redis: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
  }
};
