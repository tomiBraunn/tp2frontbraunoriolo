import type { PollOption } from '@/types'

export default function ResultsList({ options, totalVotes }: { options: PollOption[]; totalVotes: number }) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const count = option.vote_count || 0
        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0

        return (
          <div key={option.id}>
            <div className="flex justify-between text-sm mb-1">
              <span>{option.option_text}</span>
              <span className="text-gray-500">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
