import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute, useMatchRoute, useNavigate } from '@tanstack/react-router';
import { Plus, Search } from 'lucide-react';
import { z } from 'zod';
import { getUsersOptions } from '@/features/rqOptions.user';
import { cn } from '@/lib/utils';
import { UsersList } from '@/features/users/components/userList';
import { UserListItem } from '@/features/users/components/userListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/contacts')({
  component: App,
  validateSearch: z.object({
    search: z.string().optional(),
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUsersOptions())
  }
})

function App() {
  const match = useMatchRoute()
  const hasOutlet = match({ to: Route.path }) === false

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

  const getUsersPaginated = useQuery(getUsersOptions({ search }))

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
            <Link to="/contacts/new">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add contact</span>
            </Link>
          </Button>
        </div>

        {/* Search */}
        <ContactSidebarSearch searchValue={search ?? ''} />

        {/* Tabs */}
        {/* <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Star className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>
        </Tabs> */}
      </div>

      {/* Contact List */}
      <UsersList users={getUsersPaginated.data?.data ?? []} searchQuery='' selectedId={null} >
        {(user) =>
          <Link key={user.id} to="/contacts/$userId" params={{ userId: user.id }}>
            <UserListItem user={user} />
          </Link>}
      </UsersList>

      {/* Footer */}
      <div className="border-t border-border px-4 py-3 text-center text-sm text-muted-foreground">
        {getUsersPaginated.data?.pagination.total} {getUsersPaginated.data?.pagination.total === 1 ? "contact" : "contacts"}
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