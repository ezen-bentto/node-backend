// notFoundHandler.ts
import { NOT_FOUND_DATA } from "@/constants/message";
import { Request, Response, NextFunction } from "express";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: getReasonPhrase(StatusCodes.NOT_FOUND),
    message: NOT_FOUND_DATA,
  });
};
