import { getDBConnection } from '@/config/db.config';

export const findAll = async () => {
  const db = getDBConnection();
  const row = await db.query('SELECT id, name, email FROM demo');
  return row;
};
