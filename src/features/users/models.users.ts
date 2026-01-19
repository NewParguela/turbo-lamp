import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  phone: z.e164(),
  first_name: z.string(),
  last_name: z.string().nullable(),
  email: z.email().nullable(),
  avatar: z.url().nullable(),
})

export type User = z.infer<typeof UserSchema>
    