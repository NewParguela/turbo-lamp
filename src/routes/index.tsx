import { Link, createFileRoute } from '@tanstack/react-router';
import { getUsersOptions } from '@/features/rqOptions.user';

export const Route = createFileRoute('/')({
  component: App, loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(getUsersOptions())
  }
})

function App() {
  return (
    <main className='p-6 @container'>
      <Link to="/contacts">
        <div className='border shadow-xs p-4 rounded-md flex flex-col items-center justify-center hover:shadow-md transition-all duration-300'>
          <h2>Contacts</h2>
        </div>
      </Link>
    </main>
  )
}