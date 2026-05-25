import Link from 'next/link'
import type { Poll } from '@/types'

export default function PollCard({ poll }: { poll: Poll }) {
  const optionCount = poll.options?.length || 0

  return (
    <Link href={`/polls/${poll.id}`} className="block group">
      <article className="bg-paper-surface border border-paper-border p-6 hover:border-paper-primary/20 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-[family-name:var(--font-display)] font-semibold text-paper-text group-hover:text-paper-primary transition-colors truncate">
              {poll.title}
            </h2>
            {poll.description && (
              <p className="text-sm text-paper-muted mt-1 line-clamp-1">{poll.description}</p>
            )}
          </div>
          <div className="shrink-0 font-[family-name:var(--font-mono)] text-xs text-paper-muted">
            {optionCount} opc.
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-paper-muted">
          <span>{poll.profiles?.username || 'Anónimo'}</span>
          <span className="w-px h-3 bg-paper-border" />
          <span>{poll.allow_multiple ? 'Voto múltiple' : 'Voto único'}</span>
        </div>
      </article>
    </Link>
  )
}
