import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getUserByIdOptions, updateUserOptions } from '@/features/rqOptions.user'
import { UserForm } from '@/features/users/components/userForm'

export const Route = createFileRoute('/contacts/$userId/edit')({
  params: {
    parse: ({ userId }) =>
      z.object({ userId: z.coerce.number() }).parse({ userId })
  },
  loader: async ({ context, params: { userId } }) => {
    await context.queryClient.ensureQueryData(getUserByIdOptions({ id: userId }))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { userId } = Route.useParams()
  const navigate = useNavigate()

  const user = useQuery(getUserByIdOptions({ id: userId }))

  const mutation = useMutation({
    ...updateUserOptions(), onSuccess: (data) => {
      navigate({ to: '/contacts/$userId', params: { userId: userId } })
    },
  })

  return (
    <>
      {user.data && (
        <UserForm user={user.data} onSubmit={_ => mutation.mutateAsync({ id: user.data.id, user: _ })} onReset={mutation.reset} />
      )}
    </>
  )
}
