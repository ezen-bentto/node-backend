import { DemoResponseSchema } from '@/schemas/demo.schema';
import { DemoService } from '@/service/demo.service';
import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const get: RequestHandler = async (req: Request, res: Response) => {
  const data = await DemoService.get();
  const parsed = z.array(DemoResponseSchema).safeParse(data);

  if (!parsed.success) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: parsed.error.message });
    return;
  }

  res.status(StatusCodes.OK).json({ data: parsed.data });
};
