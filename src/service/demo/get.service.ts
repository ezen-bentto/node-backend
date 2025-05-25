import { ERROR_CODES } from '@/constants/error.constant';
import { DemoModel } from '@/models/demo.model';
import { DemoResponse } from '@/schemas/demo.schema';
import { AppError } from '@/utils/AppError';
import { handleDbError } from '@/utils/handleDbError';
import { StatusCodes } from 'http-status-codes';

// 반환 타입 명시
export const get = async (): Promise<DemoResponse[]> => {
  try {
    const data = await DemoModel.findAll();

    if (data.length === 0) {
      throw new AppError(StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
    return data;
  } catch (err: unknown) {
    // 예: 중복 키 에러 처리
    handleDbError(err);
    // 아래는 의미 없는 코드지만 명시적으로 적어놓음 그래야 오류 안남
    throw err;
  }
};
