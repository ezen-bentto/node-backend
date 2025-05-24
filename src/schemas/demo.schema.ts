import { z } from 'zod';

// post
export const DemoCreateSchema = z.object({
  name: z.string().min(1).max(10),
  email: z.string().email(),
});

// get
export const DemoResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(10),
  email: z.string().email(),
});

export type DemoCreate = z.infer<typeof DemoCreateSchema>;
export type DemoResponse = z.infer<typeof DemoResponseSchema>;
