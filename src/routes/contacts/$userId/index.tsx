import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdOptions } from '@/features/rqOptions.user';
import { UserDetail } from '@/features/users/components/userDetail';

export const Route = createFileRoute('/contacts/$userId/')({
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
        {data.data && (
          <UserDetail user={data.data} onEdit={() => { }} onDelete={() => { }} onToggleFavorite={() => { }} />
        )}
        {/* <div className='flex flex-col items-center justify-center p-6'>
        <img src={data.data?.avatar} alt={data.data?.first_name} className='w-24 h-24 rounded-full' />
        <h1 className='text-2xl font-bold'>{data.data?.first_name} {data.data?.last_name}</h1>
        <p className='text-sm text-muted-foreground'>{data.data?.email}</p>
        <div>
          <Button asChild>
            <Link to={"/contacts/$userId/edit"} params={{ userId }}>
              Edit
            </Link>
          </Button>
        </div>
      </div> */}
      </>
    )
  },
})
