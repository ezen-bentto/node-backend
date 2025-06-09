import { syncViewsToDb } from './syncviews.job';

setInterval(() => {
    console.log('조회수 동기화 시작')
    syncViewsToDb("contest");
    // syncViewsToDb("community");
    // syncViewsToDb("policy");
}, 1000 * 60 * 1);