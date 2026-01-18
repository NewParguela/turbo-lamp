import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.e164(),
  email: z.email().optional(),
  avatar: z.url().optional(),
})

export type User = z.infer<typeof UserSchema>
    