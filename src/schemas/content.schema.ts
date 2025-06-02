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

// 공모전 select [GET]

// 공모전 상세 select [GET]
export const getContestDetailSchema = z.object({
  id: z.number(),
});

// 공모전 상세 UPDATE [POST]
export const modContestSchema = z.object({
  writer_id: z.string(),
  title: z.string(),
  img: z.string(),
  organizer: z.string(),
  prize: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  homepage: z.string(),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  article: z.string(),
  views: z.string()
});

// 공모전 상세 삭제 UPDATE [POST]
export const delContestSchema = z.object({
  id: z.number(),
});

export type regContest = z.infer<typeof regContestSchema>;
export type detailContest = z.infer<typeof regContestSchema> & {
  views: string;
};
export type getDetailParam = z.infer<typeof getContestDetailSchema> & {
  ip: string;
};
export type modContest = z.infer<typeof modContestSchema>;
