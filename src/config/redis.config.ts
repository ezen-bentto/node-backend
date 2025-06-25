import { createClient } from 'redis';
import { ENV } from './env.config';

export const client = createClient({
  socket: {
    host: ENV.redis.host,
    port: ENV.redis.port,
    connectTimeout: 0,
  },
  legacyMode: true,
});

client.on('error', (error) => {
  console.error('Redis error:', error);
  // err 던지기
});

client.on('connect', () => {
  console.log('Redis connected');
});

// Redis 연결 초기화 함수
export const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
};

connectRedis();