import { DemoModel } from '@/models/demo.model';
import { DemoResponse } from '@/schemas/demo.schema';

// 반환 타입 명시
export const get = async (): Promise<DemoResponse[]> => {
  return await DemoModel.findAll();
};
