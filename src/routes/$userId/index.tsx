import { Outlet, createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getUserByIdOptions } from '@/features/rqOptions.user'

export const Route = createFileRoute('/$userId/')({
  params: {
    parse: ({ userId }) =>
      z.object({ userId: z.coerce.number() }).parse({ userId })
  },
  loader: async ({ context, params: { userId } }) => {
    await context.queryClient.ensureQueryData(getUserByIdOptions({ id: userId }))
  },
  component: () => {
    const { userId } = Route.useParams()
    const data = useQuery(getUserByIdOptions({ id: userId }))
    return (
      <>
        <div>Hello "/$userId/"! {data.data?.first_name}</div>

        <Outlet />
      </>
    )
  },
})
