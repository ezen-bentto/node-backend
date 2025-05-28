import { handleDbError } from '@/utils/handleDbError';

export const remove = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
