import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PollCard from '@/components/PollCard'
import type { Poll } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: myPolls } = await supabase
    .from('polls')
    .select('*, options:poll_options(*)')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const pollIds = myPolls?.map(p => p.id) || []
  const { count: totalVotes } = pollIds.length > 0
    ? await supabase.from('votes').select('*', { count: 'exact', head: true }).in('poll_id', pollIds)
    : { count: 0 }

  const totalOptions = myPolls?.reduce((acc, p) => acc + (p.options?.length || 0), 0) || 0

  return (
    <div className="max-w-3xl mx-auto mt-8 px-6 pb-16">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-paper-text">
          {profile?.username || user.email?.split('@')[0]}
        </h1>
        <p className="text-sm text-paper-muted mt-1">Panel de control</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Encuestas', value: myPolls?.length || 0 },
          { label: 'Opciones', value: totalOptions },
          { label: 'Votos', value: totalVotes || 0 },
        ].map((s) => (
          <div key={s.label} className="border border-paper-border bg-paper-surface p-5 text-center">
            <p className="font-[family-name:var(--font-mono)] text-3xl text-paper-text">{s.value}</p>
            <p className="text-xs text-paper-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        <Link href="/polls/create" className="bg-paper-primary text-paper-surface px-5 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity">
          + Nueva encuesta
        </Link>
        <Link href="/polls" className="border border-paper-border text-paper-text px-5 py-2.5 text-sm font-medium hover:bg-paper-surface transition-colors">
          Explorar encuestas
        </Link>
      </div>

      {myPolls && myPolls.length > 0 ? (
        <div>
          <h2 className="font-[family-name:var(--font-display)] font-semibold text-paper-text mb-4">Tus encuestas</h2>
          <div className="space-y-3">
            {myPolls.map((poll) => <PollCard key={poll.id} poll={poll as unknown as Poll} />)}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border border-paper-border bg-paper-surface">
          <p className="text-paper-muted font-medium">Todavía no creaste ninguna encuesta</p>
          <Link href="/polls/create" className="text-paper-primary text-sm underline underline-offset-2 hover:opacity-70 transition-opacity mt-2 inline-block">
            Crear tu primera encuesta
          </Link>
        </div>
      )}
    </div>
  )
}
