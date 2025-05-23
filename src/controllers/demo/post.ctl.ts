import { OK_JOIN } from "@/constants/message";
import { DemoCreateSchema, DemoResponseSchema } from "@/schemas/demo.schema";
import { DemoService } from "@/service/demo.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const post = async (req: Request, res: Response) => {
  const parsed = DemoCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: parsed.error.message });
    return;
  }
  const newDemo = DemoService.post(parsed.data);

  // 응답 스키마 검증
  const check = DemoResponseSchema.safeParse(newDemo);
  if (!check.success) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Invalid response format" });
    return;
  }

  // 로그인이면 token 도 해줘야할듯?
  res.status(StatusCodes.CREATED).json({ message: OK_JOIN });
};
