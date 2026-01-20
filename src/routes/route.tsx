import { useInfiniteQuery } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute, useMatchRoute, useNavigate } from '@tanstack/react-router';
import { Plus, Search } from 'lucide-react';
import { z } from 'zod';
import { useMemo } from 'react';
import type { User } from '@/features/users/models.users';
import { getUsersInfiniteOptions } from '@/features/rqOptions.user';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UsersList } from '@/features/users/components/contactsList';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export const Route = createFileRoute('')({
  component: App,
  ssr: "data-only",
  validateSearch: z.object({
    search: z.string().optional(),
  }),
  loaderDeps: (opts) => opts.search,
  loader: async ({ context, deps: { search } }) => {
    await context.queryClient.ensureInfiniteQueryData(getUsersInfiniteOptions({ search }))
  }
})

function App() {
  const match = useMatchRoute()
  const hasOutlet = match({ to: "/" }) === false

  return (
    <main className='flex h-screen w-full bg-background'>
      <ContactsSidebar className={cn(hasOutlet && "hidden md:flex")} />
      <div
        className={cn(
          "flex-1 bg-background",
          !hasOutlet && "hidden md:block"
        )}
      >
        <Outlet />
      </div>
    </main>
  )
}

const ContactsSidebar = ({ className }: { className?: string }) => {
  const { search } = Route.useSearch()

  const getUsersPaginated = useInfiniteQuery(getUsersInfiniteOptions({ search }))


  const { childRef, wrapperRef } = useIntersectionObserver({
    onChange: () => {
      getUsersPaginated
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
          <h1 className="text-2xl font-bold text-card-foreground">Contacts</h1>
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
        {getUsersPaginated.data?.pages[0]?.data.length === 0 && <UsersList.NotFound hasSearchQuery={!!search} />}

        {Object.entries(groupedUsers).map(([letter, usersGroup]) => (
          <UsersList.Section key={letter} letter={letter}>
            {usersGroup.map((user) => (
              <Link key={user.id} to="/$userId" params={{ userId: user.id }}>
                <UsersList.SectionItem user={user} />
              </Link>
            ))}
          </UsersList.Section>
        ))}

        <span ref={childRef("bottom")} />
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