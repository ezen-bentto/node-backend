import morgan from 'morgan';
import logger from './logger';

// 예시
// morgan 로그를 winston으로 연결하는 커스텀 스트림 만들기
const stream = {
    write: (message: string) => {
        // morgan 로그 메시지에서 줄바꿈 제거
        logger.info(message.trim());
    },
};

// morgan 미들웨어 기본 포맷과 함께 export
const morganMiddleware = morgan('combined', { stream });

export default morganMiddleware;