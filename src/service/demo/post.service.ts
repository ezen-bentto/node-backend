import { DemoCreate } from '@/schemas/demo.schema';
import { DemoModel } from '@/models/demo.model';
import { InsertResult } from '@/types/db/response.type';

export const post = async (data: DemoCreate): Promise<InsertResult> => {
  const res = await DemoModel.create(data);
  return res;
};
