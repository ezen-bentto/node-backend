import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = path.resolve(process.cwd(), 'logs');

const dailyRotateTransportInfo = new DailyRotateFile({
    filename: path.join(logDir, 'app-%DATE%.log'),   // 날짜별 파일명
    datePattern: 'YYYY-MM-DD',                       // 날짜 형식
    zippedArchive: true,                             // 압축 저장 여부
    maxSize: '20m',                                  // 최대 파일 크기
    maxFiles: '14d',                                 // 14일간 로그 보관
    level: 'info',
});

const dailyRotateTransportError = new DailyRotateFile({
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
        dailyRotateTransportInfo,
        dailyRotateTransportError,
    ],
    exitOnError: false,
});

export default logger;
