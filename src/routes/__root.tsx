import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
  useMatchRoute,
  useNavigate,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { z } from 'zod';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { useMemo } from 'react';
import appCss from '../styles.css?url';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import type { User } from '@/features/users/models.users';
import type { QueryClient } from '@tanstack/react-query';
import { getUsersInfiniteOptions } from '@/features/users/rqOptions.user';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UsersList } from '@/features/users/components/usersList';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';


interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  ssr: "data-only",
  validateSearch: z.object({
    search: z.string().optional(),
  }),
  loaderDeps: (opts) => opts.search,
  // loader: async ({ context, deps: { search } }) => {
  //   await context.queryClient.ensureInfiniteQueryData(getUsersInfiniteOptions({ search }))
  // },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Contacts',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const match = useMatchRoute()
  const hasOutlet = match({ to: "/" }) === false

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* <Header /> */}
        <main className='flex h-screen w-full bg-background'>
          <ContactsSidebar className={cn(hasOutlet && "hidden md:flex")} />
          <div
            className={cn(
              "flex-1 bg-background",
              !hasOutlet && "hidden md:block"
            )}
          >
            {children}
          </div>
        </main>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}


const ContactsSidebar = ({ className }: { className?: string }) => {
  const { search } = Route.useSearch()

  const getUsersPaginated = useInfiniteQuery(getUsersInfiniteOptions({ search }))


  const { childRef, wrapperRef } = useIntersectionObserver({
    onChange: () => {
      getUsersPaginated.fetchNextPage()
    }
  })

  const groupedUsers = useMemo(() => {
    const users: Array<User> = getUsersPaginated.data?.pages.flatMap(_ => _.data) ?? []
    const groups: Record<string, Array<User>> = {}
    const sorted = [...users].sort((a, b) =>
      a.first_name.localeCompare(b.first_name)
    )

    for (const user of sorted) {
      const letter = user.first_name[0].toUpperCase()
      groups[letter] ??= []
      groups[letter].push(user)
    }

    return groups

  }, [getUsersPaginated.data?.pages])

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col border-r border-border bg-card md:w-[360px] md:max-w-[360px]",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold text-card-foreground">Contacts</h1>
          </Link>
          <Button size="icon" variant="ghost" asChild>
            <Link to="/new">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add contact</span>
            </Link>
          </Button>
        </div>

        {/* Search */}
        <ContactSidebarSearch searchValue={search} />
      </div>

      {/* Contact List */}
      <UsersList ref={wrapperRef} className="overflow-y-auto">
        {getUsersPaginated.isLoading ? (<UsersList.Loading />) : (
          <>

            {getUsersPaginated.data?.pages[0]?.data.length === 0 && <UsersList.NotFound hasSearchQuery={!!search} />}

            {getUsersPaginated.isFetchingPreviousPage && <UsersList.Loading />}

            {Object.entries(groupedUsers).map(([letter, usersGroup]) => (
              <UsersList.Section key={letter} letter={letter}>
                {usersGroup.map((user) => (
                  <Link key={user.id} to="/$userId" params={{ userId: user.id }}>
                    <UsersList.SectionItem user={user} />
                  </Link>
                ))}
              </UsersList.Section>
            ))}
            {getUsersPaginated.isFetchingNextPage && <UsersList.Loading />}
            <span ref={childRef("bottom")} />
          </>
        )}
      </UsersList>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 text-center text-sm text-muted-foreground">
        {getUsersPaginated.data?.pages[0]?.pagination.total} {getUsersPaginated.data?.pages[0]?.pagination.total === 1 ? "contact" : "contacts"}
      </div>
    </div>

  )
}


const ContactSidebarSearch = ({ searchValue = "" }: { searchValue?: string }) => {
  const navigate = useNavigate()
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search contacts..."
        value={searchValue}
        onChange={(e) => navigate({ to: ".", search: (prev) => ({ ...prev, search: e.target.value }) })}
        className="pl-9"
      />
    </div>
  )
}