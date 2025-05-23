import { z } from 'zod/v4';

// post
export const DemoCreateSchema = z.object({
  name: z.string().min(1).max(10),
  email: z.email(),
});

// get
export const DemoResponseSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(10),
  email: z.email(),
});

export type DemoCreate = z.infer<typeof DemoCreateSchema>;
export type DemoResponse = z.infer<typeof DemoResponseSchema>;
