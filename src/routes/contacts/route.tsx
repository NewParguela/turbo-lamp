import { useQuery } from '@tanstack/react-query';
import { Link, Outlet, createFileRoute, useMatchRoute } from '@tanstack/react-router';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { getUsersOptions } from '@/features/rqOptions.user';
import { cn } from '@/lib/utils';
import { UsersList } from '@/features/users/components/userList';
import { UserListItem } from '@/features/users/components/userListItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/contacts')({
  component: App, loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUsersOptions())
  }
})

function App() {


  return (
    <main className='p-6 relative'>
      <h1>Users</h1>
      <div className='grid gap-4 grid-cols-3'>
        <div className='@container'>
          <ContactsSidebar />
        </div>
        <div className='w-full h-fit col-span-2s'>
          <Outlet />
        </div>
      </div>
    </main>
  )
}

const ContactsSidebar = () => {
  const data = useQuery(getUsersOptions())
  const [searchQuery, setSearchQuery] = useState('')
  // const [activeTab, setActiveTab] = useState('all')

  const match = useMatchRoute()
  const hasOutlet = match({ to: Route.path }) === false

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col border-r border-border bg-card md:w-[360px] md:max-w-[360px]",
        hasOutlet && "hidden md:flex"
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

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
      <UsersList users={data.data ?? []} searchQuery='' selectedId={null} >
        {(user) =>
          <Link key={user.id} to="/contacts/$userId" params={{ userId: user.id }}>
            <UserListItem user={user} />
          </Link>}
      </UsersList>

      {/* Footer */}
      {/* <div className="border-t border-border px-4 py-3 text-center text-sm text-muted-foreground">
      {filteredContacts.length} {filteredContacts.length === 1 ? "contact" : "contacts"}
    </div> */}
    </div>

  )
}