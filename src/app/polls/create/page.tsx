import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import PollForm from '@/components/PollForm'

export default async function CreatePollPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-lg mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Crear encuesta</h1>
      <PollForm />
    </div>
  )
}
