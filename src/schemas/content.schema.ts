import { z } from 'zod';

// 공모전 create [POST]
export const ContestCreateSchema = z.object({
  writerId: z.number().min(50),
  title: z.string(),
  img: z.string(),
  organizer: z.string(),
  prize: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  homepage: z.string(),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  article: z.string(),
});

// 공모전 select [GET]
export const ContestSelectDetailSchema = z.object({
  id: z.number(),
});

// 공모전 상세 select [GET]

// 공모전 상세 UPDATE [POST]

// 공모전 상세 삭제 UPDATE [POST]

export type ContestCreate = z.infer<typeof ContestCreateSchema>;
