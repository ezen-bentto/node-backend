// utils/AppError.ts
export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true; // 운영 중 발생한 예상 가능한 에러 표시

    Error.captureStackTrace(this, this.constructor);
  }
}
