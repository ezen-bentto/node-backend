import { handleDbError } from '@/utils/handleDbError';

export const list = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
