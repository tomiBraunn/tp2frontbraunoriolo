import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import PollDetail from './PollDetail'

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

  const { data: { user } } = await supabase.auth.getUser()

  let userVote = null
  if (user) {
    const { data: vote } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', id)
      .eq('user_id', user.id)
      .maybeSingle()

    userVote = vote?.option_id || null
  }

  const { data: votes } = await supabase
    .from('votes')
    .select('option_id')

  const voteCounts: Record<string, number> = {}
  votes?.forEach(v => {
    voteCounts[v.option_id] = (voteCounts[v.option_id] || 0) + 1
  })

  const totalVotes = votes?.length || 0

  const optionsWithCounts = poll.options.map((opt: any) => ({
    ...opt,
    vote_count: voteCounts[opt.id] || 0,
  }))

  return (
    <PollDetail
      poll={poll}
      options={optionsWithCounts}
      totalVotes={totalVotes}
      userVote={userVote}
      userId={user?.id || null}
    />
  )
}
