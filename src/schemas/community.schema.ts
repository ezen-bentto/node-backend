import { z } from 'zod';
import { RecruitmentDetailRegisterRequest, RecruitmentDetailUpdateRequest } from './recruitmentDetail.schema';

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
        ageGroup: z.string().optional().nullable(), // 모집 연령
        title: z.string().min(1, '제목을 입력해주세요.'),
        content: z.string().min(1, '내용을 입력해주세요.'),

        // 모집상세 배열 추가
        recruitments: z.array(RecruitmentDetailRegisterRequest).optional(),
    })
    .superRefine((data, ctx) => {
        const {
            communityType,
            contestId,
            startDate,
            endDate,
            recruitEndDate,
            categoryType,
            ageGroup,
            recruitments,
        } = data;

        const isValidDate = (val?: string | null) => val && !isNaN(Date.parse(val));

        // === [1] 공모전: 모든 필드 필수 + 모집상세 필수
        if (communityType === '1') {
            if (!contestId) {
                ctx.addIssue({ path: ['contestId'], message: '공모전 ID가 필요합니다.', code: z.ZodIssueCode.custom });
            }
            if (!categoryType) {
                ctx.addIssue({ path: ['categoryType'], message: '카테고리가 필요합니다.', code: z.ZodIssueCode.custom });
            }
            if (!isValidDate(startDate)) {
                ctx.addIssue({ path: ['startDate'], message: '시작일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!isValidDate(endDate)) {
                ctx.addIssue({ path: ['endDate'], message: '종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!isValidDate(recruitEndDate)) {
                ctx.addIssue({ path: ['recruitEndDate'], message: '모집 종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!ageGroup) {
                ctx.addIssue({ path: ['ageGroup'], message: '모집 연령이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!recruitments || recruitments.length === 0) {
                ctx.addIssue({ path: ['recruitments'], message: '모집 상세 정보는 필수입니다.', code: z.ZodIssueCode.custom });
            }
        }

        // === [2] 스터디: 날짜 3개 + 모집연령 + 모집상세 필수
        if (communityType === '2') {
            if (!isValidDate(startDate)) {
                ctx.addIssue({ path: ['startDate'], message: '시작일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!isValidDate(endDate)) {
                ctx.addIssue({ path: ['endDate'], message: '종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!isValidDate(recruitEndDate)) {
                ctx.addIssue({ path: ['recruitEndDate'], message: '모집 종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!ageGroup) {
                ctx.addIssue({ path: ['ageGroup'], message: '모집 연령이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!recruitments || recruitments.length === 0) {
                ctx.addIssue({ path: ['recruitments'], message: '모집 상세 정보는 필수입니다.', code: z.ZodIssueCode.custom });
            }
        }

        // === [3] 자유: 모집상세가 있으면 에러
        if (communityType === '3') {
            if (recruitments && recruitments.length > 0) {
                ctx.addIssue({
                    path: ['recruitments'],
                    message: '자유글은 모집 상세 정보를 포함할 수 없습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });


// 2. 커뮤니티 글 UPDATE [POST]
export const CommunityUpdateRequest = z
    .object({
        communityId: z.number().min(1),
        communityType: z.enum(['1', '2', '3']),
        contestId: z.number().min(1).optional().nullable(),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        recruitEndDate: z.string().optional().nullable(),
        title: z.string().min(1, '제목을 입력해주세요.'),
        content: z.string().trim().min(1, '내용을 입력해주세요.'),
        categoryType: z.number().min(1).optional().nullable(),
        ageGroup: z.string().optional().nullable(),
        recruitments: z.array(RecruitmentDetailUpdateRequest).optional(),
    })
    .superRefine((data, ctx) => {
        const {
            communityType,
            contestId,
            startDate,
            endDate,
            recruitEndDate,
            categoryType,
            ageGroup,
            recruitments,
        } = data;

        // 공모전 (1)
        if (communityType === '1') {
            if (!contestId) {
                ctx.addIssue({ path: ['contestId'], message: '공모전 ID가 필요합니다.', code: z.ZodIssueCode.custom });
            }
            if (!startDate || isNaN(Date.parse(startDate))) {
                ctx.addIssue({ path: ['startDate'], message: '시작일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!endDate || isNaN(Date.parse(endDate))) {
                ctx.addIssue({ path: ['endDate'], message: '종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!recruitEndDate || isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({ path: ['recruitEndDate'], message: '모집 종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!categoryType) {
                ctx.addIssue({ path: ['categoryType'], message: '카테고리가 필요합니다.', code: z.ZodIssueCode.custom });
            }
            if (!ageGroup) {
                ctx.addIssue({ path: ['ageGroup'], message: '모집 연령이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
        }

        // 스터디 (2)
        if (communityType === '2') {
            if (!startDate || isNaN(Date.parse(startDate))) {
                ctx.addIssue({ path: ['startDate'], message: '시작일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!endDate || isNaN(Date.parse(endDate))) {
                ctx.addIssue({ path: ['endDate'], message: '종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!recruitEndDate || isNaN(Date.parse(recruitEndDate))) {
                ctx.addIssue({ path: ['recruitEndDate'], message: '모집 종료일이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
            if (!ageGroup) {
                ctx.addIssue({ path: ['ageGroup'], message: '모집 연령이 선택되지 않았습니다.', code: z.ZodIssueCode.custom });
            }
        }

        // === [3] 자유: 모집상세가 있으면 에러
        if (communityType === '3') {
            if (recruitments && recruitments.length > 0) {
                ctx.addIssue({
                    path: ['recruitments'],
                    message: '자유글은 모집 상세 정보를 포함할 수 없습니다.',
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });

// 3. 커뮤니티 글 DELETE [POST]
export const CommunityDeleteRequest = z.object({
    communityId: z.number().min(1).optional().nullable(),
})


export type CommunityRegisterRequest = z.infer<typeof CommunityRegisterRequest>;
export type CommunityUpdateRequest = z.infer<typeof CommunityUpdateRequest>;
export type CommunityDeleteRequest = z.infer<typeof CommunityDeleteRequest>;
