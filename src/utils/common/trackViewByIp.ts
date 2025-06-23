import { client } from '@/config/redis.config';

const trackViewByIp = async (
  resource: string,
  id: number,
  ip: string,
  contestView: string
): Promise<void> => {
  const ipKey = `${resource}${id}:ip${ip}`;
  const viewsKey = `${resource}:${id}:views`;

  const isVisited = await client.v4.get(ipKey);

  // 이전에 들어왔다면 기록 X
  if (isVisited) return;

  // 처음 들어오면 24시간 동안 IP 기록
  await client.v4.setEx(ipKey, 60 * 60 * 24, '1');

  // redis 조회수 count
  const currentViews = await client.v4.get(viewsKey);
  if (currentViews === null) {
    await client.v4.set(viewsKey, (parseInt(contestView) + 1).toString());
  } else {
    await client.v4.incr(viewsKey);
  }
};

export default trackViewByIp;
