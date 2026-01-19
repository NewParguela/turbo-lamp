import { Link, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/contacts/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex items-center justify-center'>
      <div className='text-center text-sm text-muted-foreground'>No contact selected</div>
      <div className='flex items-center justify-center'>
        <Button asChild>
          <Link to="/contacts/new">
            New Contact
          </Link>
        </Button>
      </div>
    </div>)
}
