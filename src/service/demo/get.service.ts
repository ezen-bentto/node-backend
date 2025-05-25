import { ERROR_CODES } from '@/constants/error.constant';
import { NOT_FOUND_POSTS } from '@/constants/message.constant';
import { DemoModel } from '@/models/demo.model';
import { DemoResponse } from '@/schemas/demo.schema';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';

// 반환 타입 명시
export const get = async (): Promise<DemoResponse[]> => {
  const data = await DemoModel.findAll();
  if (data.length === 0) {
    throw new AppError(NOT_FOUND_POSTS, StatusCodes.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
  return data;
};
