import { getDBConnection } from '@/config/db.config';
import { DemoCreate } from '@/schemas/demo.schema';
import { InsertResult } from '@/types/db/response.type';
import { v4 as uuidv4 } from 'uuid';

export const create = async (data: DemoCreate): Promise<InsertResult> => {
  const { name, email } = data;
  const id = uuidv4();

  const db = getDBConnection();
  const result = await db.query('INSERT INTO demo (id, name, email) VALUES (?, ?, ?)', [
    id,
    name,
    email,
  ]);
  return result;
};
