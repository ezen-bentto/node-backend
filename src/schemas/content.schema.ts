import { z } from 'zod';

/**
 *
 * 공모전 스키마 정의
 *
 * @function regContestSchema, getContestDetailSchema, modContestSchema, delContestSchema
 * @date 2025/05/30
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/05/30           한유리             신규작성  
 * @param 없음
 */

// 공모전 create [POST]
export const regContestSchema = z.object({
  writerId: z.number().min(0),
  title: z.string(),
  img: z.string(),
  organizer: z.string(),
  prize: z.string(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}),
  homepage: z.string(),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  article: z.string(),
});

// 공모전 select [GET]

// 공모전 상세 select [GET]
export const getContestDetailSchema = z.object({
  id: z.number(),
});

// 공모전 상세 UPDATE [POST]
export const modContestSchema = z.object({
  writerId: z.number().min(50),
  title: z.string().optional(),
  img: z.string().optional(),
  organizer: z.string().optional(),
  prize: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  homepage: z.string().optional(),
  participants: z.string().optional(),
  benefits: z.string().optional(),
  contest_tag: z.string().optional(),
  article: z.string().optional(),
});

// 공모전 상세 삭제 UPDATE [POST]
export const delContestSchema = z.object({
  id: z.number(),
});

export type regContest = z.infer<typeof regContestSchema>;
export type regContestView = z.infer<typeof regContestSchema> & {
  views: number;
};
export type getContestDetail = z.infer<typeof getContestDetailSchema> & {
  ip: string;
};
export type modContest = z.infer<typeof modContestSchema>;
