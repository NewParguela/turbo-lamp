import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getUserByIdOptions } from '@/features/rqOptions.user'
import { UserForm } from '@/features/users/components/userForm'

export const Route = createFileRoute('/users/$userId/edit')({
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
  const data = useQuery(getUserByIdOptions({ id: userId }))

  return <UserForm user={data.data} onSubmit={() => { }} onReset={() => { }} />
}
