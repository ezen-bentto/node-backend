import { z } from 'zod';

// 사용자가 보내는 데이터만 검증
// 자동 처리되거나 디폴트가 지정된 필드는 생략 가능
// schema = DTO

// 1. 커뮤니티 글 CREATE [POST]
export const CommunityRegisterRequest = z
    .object({
        communityType: z.enum(['1', '2', '3']), // '1': 공모전, '2': 스터디, '3': 자유
        contestId: z.number().min(1).optional().nullable(),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        recruitEndDate: z.string().optional().nullable(),
        categoryType: z.number().min(1).optional().nullable(),
        content: z.string().min(1, '내용을 입력해주세요.'),
    })
    .superRefine((data, ctx) => {
        const {
            communityType,
            contestId,
            startDate,
            endDate,
            recruitEndDate,
            categoryType,
        } = data;

        // === [1] 공모전: 모든 필드 필수
        if (communityType === '1') {
            if (!contestId) {
                ctx.addIssue({
                    path: ['contestId'],
                    message: '공모전 ID가 필요합니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!categoryType) {
                ctx.addIssue({
                    path: ['categoryType'],
                    message: '카테고리가 필요합니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!startDate || isNaN(Date.parse(startDate))) {
                ctx.addIssue({
                    path: ['startDate'],
                    message: '시작일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!endDate || isNaN(Date.parse(endDate))) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: '종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!recruitEndDate || isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({
                    path: ['recruitEndDate'],
                    message: '모집 종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        // === [2] 스터디: 날짜 3개만 필수
        if (communityType === '2') {
            if (!startDate || isNaN(Date.parse(startDate))) {
                ctx.addIssue({
                    path: ['startDate'],
                    message: '시작일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!endDate || isNaN(Date.parse(endDate))) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: '종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!recruitEndDate || isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({
                    path: ['recruitEndDate'],
                    message: '모집 종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        // === [3] 자유: 아무 것도 없어도 되지만, 날짜 형식은 유효해야 함
        if (communityType === '3') {
            if (startDate && isNaN(Date.parse(startDate))) {
                ctx.addIssue({
                    path: ['startDate'],
                    message: '시작일 형식이 올바르지 않습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (endDate && isNaN(Date.parse(endDate))) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: '종료일 형식이 올바르지 않습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (recruitEndDate && isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({
                    path: ['recruitEndDate'],
                    message: '모집 종료일 형식이 올바르지 않습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

// 2. 커뮤니티 글 UPDATE [POST]
export const CommunityUpdateRequest = z
    .object({
        communityType: z.enum(['1', '2', '3']),
        contestId: z.number().min(1).optional().nullable(),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        recruitEndDate: z.string().optional().nullable(),
        content: z.string().trim().min(1, '내용을 입력해주세요.'), // 필수
        categoryType: z.number().min(1).optional().nullable(),
    })
    .superRefine((data, ctx) => {
        const { communityType, contestId, startDate, endDate, recruitEndDate, categoryType } = data;

        // === 공모전 (1): 전부 필요
        if (communityType === '1') {
            if (!contestId) {
                ctx.addIssue({
                    path: ['contestId'],
                    message: '공모전 ID가 필요합니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!startDate || isNaN(Date.parse(startDate))) {

                ctx.addIssue({
                    path: ['startDate'],
                    message: '시작일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!endDate || isNaN(Date.parse(endDate))) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: '종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!recruitEndDate || isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({
                    path: ['recruitEndDate'],
                    message: '모집 종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!categoryType) {
                ctx.addIssue({
                    path: ['categoryType'],
                    message: '카테고리가 필요합니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        // === 스터디 (2): 날짜만 필요
        if (communityType === '2') {
            if (!startDate || isNaN(Date.parse(startDate))) {
                ctx.addIssue({
                    path: ['startDate'],
                    message: '시작일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!endDate || isNaN(Date.parse(endDate))) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: '종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (!recruitEndDate || isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({
                    path: ['recruitEndDate'],
                    message: '모집 종료일이 선택되지 않았습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        // === 자유 (3): 날짜는 있어도 되고 형식만 체크
        if (communityType === '3') {
            if (startDate && isNaN(Date.parse(startDate))) {
                ctx.addIssue({
                    path: ['startDate'],
                    message: '시작일 형식이 올바르지 않습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (endDate && isNaN(Date.parse(endDate))) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: '종료일 형식이 올바르지 않습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }

            if (recruitEndDate && isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({
                    path: ['recruitEndDate'],
                    message: '모집 종료일 형식이 올바르지 않습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });


// 3. 커뮤니티 글 DELETE [POST]
export const CommunityDeleteRequest = z.object({
    communityId: z.number().min(1).optional().nullable(),
})

// 4. 커뮤니티 목록 조회 SELECT [GET]
export const CommunitySelectRequest = z.object({

})

// 5. 커뮤니티 상세 조회 SELECT [GET]
export const CommunitySelectContentRequest = z.object({
    communityId: z.number().min(1).optional().nullable(),
})


export type CommunityRegisterRequest = z.infer<typeof CommunityRegisterRequest>;
export type CommunityUpdateRequest = z.infer<typeof CommunityUpdateRequest>;
export type CommunityDeleteRequest = z.infer<typeof CommunityDeleteRequest>;
export type CommunitySelectRequest = z.infer<typeof CommunitySelectRequest>;
export type CommunitySelectContentRequest = z.infer<typeof CommunitySelectContentRequest>;
