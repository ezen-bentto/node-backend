import { z } from 'zod';

// 1. 댓글 등록 [POST]
export const CommentRegisterRequest = z
    .object({
        postId: z.number().min(1, "글을 선택해주세요"),
        content: z.string().min(1, "댓글 내용을 입력해주세요.").max(1000, "댓글은 1000자 이내로 작성해주세요."),
    });

// 2. 댓글 수정 [POST]
export const CommentUpdateRequest = z
    .object({
        commentId: z.number().min(1, "수정할 댓글을 선택해주세요"),
        content: z.string().min(1, '내용을 입력해주세요.'),
    });

// 3. 댓글 삭제 [POST]
export const CommentDeleteRequest = z.object({
    commentId: z.number().min(1).optional().nullable(),
})


export type CommentRegisterRequest = z.infer<typeof CommentRegisterRequest>;
export type CommentUpdateRequest = z.infer<typeof CommentUpdateRequest>;
export type CommentDeleteRequest = z.infer<typeof CommentDeleteRequest>;

