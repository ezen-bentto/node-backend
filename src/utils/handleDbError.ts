// utils/handleDbError.ts
import { ERROR_CODES } from '@/constants/error.constant';
import { AppError } from './AppError';
import { StatusCodes } from 'http-status-codes';

export const handleDbError = (err: unknown): never => {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const dbErr = err as { code: string };

    switch (dbErr.code) {
      case 'ER_DUP_ENTRY':
        throw new AppError(StatusCodes.BAD_REQUEST, ERROR_CODES.DUPLICATE_ENTRY);

      // 필요 시 다른 DB 에러도 추가 가능
      // case 'ER_NO_REFERENCED_ROW':
      //   throw new AppError(...);
    }
  }

  throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, ERROR_CODES.DB_ERROR);
};
