import { createFileRoute } from '@tanstack/react-router'
import { UserForm } from '@/features/users/components/userForm'

export const Route = createFileRoute('/contacts/new')({
  component: RouteComponent,
})

function RouteComponent() {

  return <div className='flex items-center justify-center'>
    <UserForm onSubmit={() => { }} onReset={() => { }} />
  </div>
}