import { Link, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeftIcon } from 'lucide-react';
import { getUserByIdOptions } from '@/features/users/rqOptions.user';
import { UserDetail } from '@/features/users/components/userDetail';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/$userId/')({
  ssr: "data-only",
  params: {
    parse: ({ userId }) =>
      z.object({ userId: z.coerce.number() }).parse({ userId })
  },
  loader: async ({ context, params: { userId } }) => {
    return await context.queryClient.ensureQueryData(getUserByIdOptions({ id: userId }))
  },
  head: ({ loaderData }) => {
    return {
      meta: [
        {
          title: `Contacts - ${loaderData?.first_name} ${loaderData?.last_name}`,
        },
      ],
    }
  },
  component: () => {
    const { userId } = Route.useParams()
    const data = useQuery(getUserByIdOptions({ id: userId }))
    return (
      <>
        <div className="block md:hidden fixed top-4 left-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="..">
              <ChevronLeftIcon />
              Back
            </Link>
          </Button>
        </div >
        {
          data.data && (
            <UserDetail user={data.data} />
          )
        }
      </>
    )
  },
})
