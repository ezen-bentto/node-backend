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
 *        2025/06/24           김혜미             추가작성 
 * @param 없음
 */

// 공모전 create
export const regContestSchema = z.object({
  id: z.string(),
  writer_id: z.string(),
  title: z.string(),
  organizer: z.string(),
  organizer_type: z.string(),
  prize: z.string(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  homepage: z.string(),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  article: z.string(),
  reg_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

// 북마크
export const regBookSchema = z.object({
  target_id: z.string(),
});

// 공모전 리스트
export const getContestListSchema = z.object({
  id: z.string(),
  title: z.string(),
  organizer: z.string(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  participants: z.string(),
  benefits: z.string(),
  contest_tag: z.string(),
  views: z.string(),

});

// 공모전 상세 select
export const getContestDetailSchema = z.object({
  id: z.number(),
});

// 공모전 상세 UPDATE
export const modContestSchema = z.object({
  title: z.string().optional(),
  organizer: z.string().optional(),
  prize: z.string().optional(),
  start_date: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
  end_date: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .optional(),
  homepage: z.string().optional(),
  participants: z.string().optional(),
  benefits: z.string().optional(),
  contest_tag: z.string().optional(),
  article: z.string().optional(),
  views: z.string().optional(),
});

// 공모전 상세 삭제 UPDATE
export const delContestSchema = z.object({
  id: z.number(),
});

// 커뮤니티 연관 스키마
// 카테고리별 공모전 조회 파라미터
export const getContestByCategorySchema = z.object({
  categoryId: z.number().int().positive({
    message: "유효한 카테고리 ID를 선택해주세요."
  }),
});
// 카테고리별 공모전 목록 응답 스키마
export const contestListItemSchema = z.object({
  contest_id: z.number(),
  title: z.string(),
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
  id: number;
};
export type delContest = z.infer<typeof delContestSchema>;

export type regBookmark = z.infer<typeof regBookSchema> & {
  user_id: string;
};

export type getContestByCategoryParam = z.infer<typeof getContestByCategorySchema>;
export type contestListItem = z.infer<typeof contestListItemSchema>;
