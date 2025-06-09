import { client } from '@/config/redis.config';

const trackViewByIp = async (resource: string, id: number, ip: string): Promise<void> => {
  const ipKey = `${resource}${id}:ip${ip}`;
  const viewsKey = `${resource}:${id}:views`;

  const isVisited = await client.v4.get(ipKey);

  if (isVisited == null) {
    await client.v4.setEx(ipKey, 60 * 60 * 24, '1'); // 24시간 동안 IP 기록
    await client.v4.incr(viewsKey); // 조회수 증가
  }
};

export default trackViewByIp;
