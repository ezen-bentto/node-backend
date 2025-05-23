import { OK_JOIN } from '@/constants/message';
import { DemoCreateSchema } from '@/schemas/demo.schema';
import { DemoService } from '@/service/demo.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const post = async (req: Request, res: Response) => {
  const parsed = DemoCreateSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: parsed.error.message });
    return;
  }
  const result = await DemoService.post(parsed.data);

  if (result.affectedRows === 1) {
    res.status(StatusCodes.CREATED).json({ message: OK_JOIN });
    return;
  } else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Invalid response format' });
};
