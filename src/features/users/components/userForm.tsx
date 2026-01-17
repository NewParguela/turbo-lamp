import { z } from 'zod'

import { createUser } from '../api.users'
import type { User } from '../models.users'
import { useAppForm } from '@/hooks/demo.form'

const createUserSchema = z.object({
  email: z.email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  avatar: z.url('Please enter a valid URL for the avatar'),
})

type CreateUserForm = z.infer<typeof createUserSchema>

export function UserForm({ user } : {user?: User, onSubmit: (user: User) => void, onReset: () => void}) {
  const form = useAppForm({
    defaultValues: {
      email: user?.email ?? '',
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      avatar: user?.avatar ?? '',
    } satisfies CreateUserForm,
    validators: {
      onBlur: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const newUser = await createUser(value)
        alert(`User created successfully! ID: ${newUser.id}`)
        // Reset form after successful submission
        form.reset()
      } catch (error) {
        alert(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
  })

  return (
    <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
      <h2 className="text-3xl font-bold mb-6 text-white">Create New User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-6"
      >
        <form.AppField name="email">
          {(field) => <field.TextField label="Email" placeholder="user@example.com" />}
        </form.AppField>

        <form.AppField name="first_name">
          {(field) => <field.TextField label="First Name" placeholder="John" />}
        </form.AppField>

        <form.AppField name="last_name">
          {(field) => <field.TextField label="Last Name" placeholder="Doe" />}
        </form.AppField>

        <form.AppField name="avatar">
          {(field) => (
            <field.TextField
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpg"
            />
          )}
        </form.AppField>

        <div className="flex justify-end">
          <form.AppForm>
            <form.SubscribeButton label="Create User" />
          </form.AppForm>
        </div>
      </form>
    </div>
  )
}
