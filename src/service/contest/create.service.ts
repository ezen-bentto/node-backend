import { handleDbError } from '@/utils/handleDbError';

export const create = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
