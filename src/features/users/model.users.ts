import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar: z.url(),
})

export type User = z.infer<typeof UserSchema>
    