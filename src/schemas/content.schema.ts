import { z } from 'zod';

/**
 *
 * 공모전 스키마 정의
 *
 * @function regContestSchema, getContestDetailSchema, modContestSchema, delContestSchema
 * @date 2025/06/09
 * @history
 * -------------------------------------------------------
 *           변경일             작성자             변경내용
 * -------------------------------------------------------
 *
 *        2025/06/09           한유리               
 * @param 없음
 */

// 공모전 create
export const regContestSchema = z.object({
  writer_id: z.string(),
  title: z.string(),
  img: z.string(),
  organizer: z.string(),
  prize: z.string(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}),
  homepage: z.string(),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  article: z.string(),
});

// 공모전 리스트
export const getContestListSchema = z.object({
  title: z.string(),
  img: z.string(),
  organizer: z.string(),
  prize: z.string(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  views: z.string()
});

// 공모전 상세 select
export const getContestDetailSchema = z.object({
  id: z.number(),
});

// 공모전 상세 UPDATE
export const modContestSchema = z.object({
  title: z.string().optional(),
  img: z.string().optional(),
  organizer: z.string().optional(),
  prize: z.string().optional(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}).optional(),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
  message: "Invalid date format"}).optional(),
  homepage: z.string().optional(),
  participants: z.string().optional(),
  benefits: z.string().optional(),
  contest_tag: z.string().optional(),
  article: z.string().optional(),
  views: z.string().optional()
});

// 공모전 상세 삭제 UPDATE
export const delContestSchema = z.object({
  id: z.number(),
});

export type regContest = z.infer<typeof regContestSchema>;
export type getContestList = z.infer<typeof getContestListSchema>;
export type detailContest = z.infer<typeof regContestSchema> & {
  views: string;
};
export type getDetailParam = z.infer<typeof getContestDetailSchema> & {
  ip: string;
};
export type modContest = z.infer<typeof modContestSchema> & {
  id: number,
};
export type delContest = z.infer<typeof delContestSchema>;