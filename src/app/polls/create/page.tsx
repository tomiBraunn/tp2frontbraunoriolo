import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import PollForm from '@/components/PollForm'

export default async function CreatePollPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="max-w-lg mx-auto mt-8 px-6 pb-16">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-paper-text">Crear encuesta</h1>
        <p className="text-sm text-paper-muted mt-1">Completá los datos para crear tu encuesta</p>
      </div>
      <div className="bg-paper-surface border border-paper-border p-8">
        <PollForm />
      </div>
    </div>
  )
}
