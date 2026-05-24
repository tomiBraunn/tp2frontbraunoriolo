import Link from 'next/link'
import type { Poll } from '@/types'

export default function PollCard({ poll }: { poll: Poll }) {
  const totalVotes = poll.options?.reduce((sum, o) => sum + (o.vote_count || 0), 0) || 0

  return (
    <Link href={`/polls/${poll.id}`}>
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <h3 className="font-semibold text-lg mb-1">{poll.title}</h3>
        <p className="text-gray-500 text-sm mb-2">{poll.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>por {poll.profiles?.username || 'Anónimo'}</span>
          <span>{totalVotes} voto{totalVotes !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </Link>
  )
}
