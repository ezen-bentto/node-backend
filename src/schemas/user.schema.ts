// src/schemas/user.schema.ts
import { z } from "zod/v4";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;
