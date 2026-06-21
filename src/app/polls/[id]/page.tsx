import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import PollView from './PollView'
import type { PollOption } from '@/types'

export default async function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: poll } = await supabase
    .from('polls')
    .select('*, profiles(username), options:poll_options(*)')
    .eq('id', id)
    .single()

  if (!poll) {
    notFound()
  }

  const { data: votes } = await supabase.from('votes').select('*').eq('poll_id', id)

  const counts: Record<string, number> = {}
  votes?.forEach((v) => { counts[v.option_id] = (counts[v.option_id] || 0) + 1 })

  const optionsWithCounts = (poll.options as PollOption[]).map((opt) => ({
    ...opt,
    vote_count: counts[opt.id] || 0,
  }))

  return <PollView poll={poll} options={optionsWithCounts} totalVotes={votes?.length || 0} />
}
