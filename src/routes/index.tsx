import { Link, createFileRoute } from '@tanstack/react-router'
import { Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  ssr: "data-only",

})

function RouteComponent() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-foreground">No contact selected</h3>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Select a contact from the list to view their details, or create a new contact.
      </p>
      <Button className="mt-6 gap-2" asChild>
        <Link to="/new">
          <Plus className="h-4 w-4" />
          New Contact
        </Link>
      </Button>
    </div>

  )
}
