import { DemoCreate } from '@/schemas/demo.schema';
import { DemoModel } from '@/models/demo.model';
import { InsertResult } from '@/types/db/response.type';
import { AppError } from '@/utils/AppError';
import { StatusCodes } from 'http-status-codes';
import { ERROR_CODES } from '@/constants/error.constant';
import { BAD_REQUEST_UPLOAD_POST } from '@/constants/message.constant';

export const post = async (data: DemoCreate): Promise<InsertResult> => {
  const res = await DemoModel.create(data);
  if (res.affectedRows !== 1) {
    throw new AppError(
      BAD_REQUEST_UPLOAD_POST,
      StatusCodes.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INSERT_FAIL
    );
  }
  return res;
};
