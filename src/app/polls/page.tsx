import { createClient } from '@/lib/supabaseServer'
import PollCard from '@/components/PollCard'
import type { Poll } from '@/types'

export default async function PollsPage() {
  const supabase = await createClient()

  const { data: polls } = await supabase
    .from('polls')
    .select('*, profiles(username), options:poll_options(*, votes(count))')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const mappedPolls: Poll[] = (polls || []).map((poll: any) => ({
    ...poll,
    options: poll.options?.map((opt: any) => ({
      ...opt,
      vote_count: opt.votes?.[0]?.count || 0,
    })),
  }))

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Encuestas</h1>
      {mappedPolls.length === 0 ? (
        <p className="text-gray-500">No hay encuestas todavía.</p>
      ) : (
        <div className="space-y-4">
          {mappedPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  )
}
