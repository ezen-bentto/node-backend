import { client } from '@/config/redis.config';
import { ContestModel } from '@/models/contest.model';
// 필요하다면 CommunityModel, PolicyModel도 import
// import { CommunityModel } from '@/models/community.model';
// import { PolicyModel } from '@/models/policy.model';

/**
 *
 * 조회수 레디스 캐싱
 * 
 * Redis에 임시 저장된 조회수 데이터를 데이터베이스에 동기화
 * Redis 키: `${target}:${id}:views` 형태로 저장됨 (예: contest:123:views)
 * 특정 대상(target)의 모든 조회수 데이터를 불러와 DB에 적용 후 Redis 키 삭제
 *
 * @function syncViewsToDb
 * @date 2025/06/04
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/04           한유리             신규작성  
 * @param target ('contest' | 'community' | 'policy')
 */
export const syncViewsToDb = async (target: 'contest' | 'community' | 'policy') => {
  try {
    // 타겟에 해당하는 모든 조회수 관련 Redis 키 조회
    const keys = await client.v4.keys(`${target}:*:views`);

    // 각 Redis 키에 대해 반복 처리
    for (const key of keys) {
      // 키에서 ID 추출 (예: contest:123:views → 123)
      const id = key.split(':')[1];
      // 해당 키의 조회수 값을 가져옴
      const views = await client.v4.get(key);
      if (!views) continue;

      const viewsCount = parseInt(views);
      if (isNaN(viewsCount)) continue;

      // 타겟에 따라 처리
      switch (target) {
        case 'contest':
          // console.log(key);
          await ContestModel.addCntViews(viewsCount, id);
          break;
        case 'community':
        //   await CommunityModel.incrementViews(id, viewsCount);
          break;
        case 'policy':
        //   await PolicyModel.incrementViews(id, viewsCount);
          break;
        default:
          console.warn(`[syncViewsToDb] 알 수 없는 매개변수: ${target}`);
          continue;
      }

      await client.v4.del(key); // Redis 키 삭제
    }

    console.log(`[syncViewsToDb] ${keys.length}건 (${target}) 동기화 완료`);
  } catch (err) {
    console.error(`[syncViewsToDb] ${target} 조회수 동기화 실패:`, err);
  }
};
