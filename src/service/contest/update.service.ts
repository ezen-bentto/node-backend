import { handleDbError } from '@/utils/handleDbError';

export const update = async () => {
  try {
    return;
  } catch (err: unknown) {
    handleDbError(err);
    throw err;
  }
};
