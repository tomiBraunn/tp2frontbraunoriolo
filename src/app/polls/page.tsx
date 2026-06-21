import { createClient } from '@/lib/supabaseServer'
import PollCard from '@/components/PollCard'
import type { Poll, PollOption } from '@/types'

export default async function PollsPage() {
  const supabase = await createClient()

  const { data: polls } = await supabase
    .from('polls')
    .select('*, profiles(username), options:poll_options(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const pollsWithCounts: Poll[] = (polls || []).map((poll) => ({
    ...poll,
    options: ((poll.options as PollOption[]) || []).map((opt) => ({ ...opt, vote_count: 0 })),
  })) as unknown as Poll[]

  return (
    <div className="max-w-2xl mx-auto mt-8 px-6 pb-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-paper-text">Encuestas</h1>
        <span className="font-[family-name:var(--font-mono)] text-xs text-paper-muted">{pollsWithCounts.length} activas</span>
      </div>
      {pollsWithCounts.length === 0 ? (
        <div className="text-center py-20 border border-paper-border bg-paper-surface">
          <p className="text-paper-muted font-medium">No hay encuestas todavía</p>
          <p className="text-xs text-paper-muted mt-1">Creá la primera</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pollsWithCounts.map((poll) => <PollCard key={poll.id} poll={poll} />)}
        </div>
      )}
    </div>
  )
}
