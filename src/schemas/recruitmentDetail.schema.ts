import { z } from 'zod';

export const RecruitmentDetailRegisterRequest = z.object({
    role: z.string().min(1, '역할을 입력해주세요.'),
    count: z.number().int().positive('1 이상의 숫자를 입력해주세요.'),
});


export const RecruitmentDetailUpdateRequest = z.object({
    recruitmentDetailId: z.number().optional(), // 있으면 수정, 없으면 새로 insert
    role: z.string().min(1, '역할은 입력해주세요.'),
    count: z.number().min(1, '인원은 1명 이상이어야 합니다.'),
});

export type RecruitmentDetailRegisterRequest = z.infer<typeof RecruitmentDetailRegisterRequest>;
export type RecruitmentDetailUpdateRequest = z.infer<typeof RecruitmentDetailUpdateRequest>;

