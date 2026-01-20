import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { UserForm } from '@/features/users/components/userForm'
import { createUserOptions } from '@/features/rqOptions.user'

export const Route = createFileRoute('/new')({
  component: RouteComponent,
  ssr: "data-only",

})

function RouteComponent() {
  const navigate = useNavigate()
  const mutation = useMutation({
    ...createUserOptions(), onSuccess: (data) => {
      navigate({ to: '/$userId', params: { userId: data.id } })
    }
  })
  return (
    <UserForm onSubmit={mutation.mutateAsync} onReset={() => navigate({ to: '/' })} />
  )
}