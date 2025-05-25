export const ERROR_CODES = {
  VALIDATION_FAIL: 'E001',
  DUPLICATE_EMAIL: 'E002',
  INSERT_FAIL: 'E003',
  NOT_FOUND: 'E004',
  INTERNAL_ERROR: 'E999',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
