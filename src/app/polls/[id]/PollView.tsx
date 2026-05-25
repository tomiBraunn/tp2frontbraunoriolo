'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import PieChart from '@/components/PieChart'
import type { Poll, PollOption } from '@/types'

const SESSION_KEY = 'poll_session_id'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export default function PollView({
  poll,
  options: initialOptions,
  totalVotes: initialTotal,
}: {
  poll: Poll
  options: PollOption[]
  totalVotes: number
}) {
  const router = useRouter()
  const supabase = createClient()
  const sessionId = getSessionId()

  const [options, setOptions] = useState<PollOption[]>(initialOptions)
  const [totalVotes, setTotalVotes] = useState(initialTotal)
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null))
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel(`poll-${poll.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${poll.id}`,
      }, async () => {
        const { data: newVotes } = await supabase.from('votes').select('*').eq('poll_id', poll.id)
        if (newVotes) {
          const counts: Record<string, number> = {}
          newVotes.forEach((v) => { counts[v.option_id] = (counts[v.option_id] || 0) + 1 })
          setOptions((prev) => prev.map((o) => ({ ...o, vote_count: counts[o.id] || 0 })))
          setTotalVotes(newVotes.length)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [poll.id])

  useEffect(() => {
    supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', poll.id)
      .or(`voter_session.eq.${sessionId},voter_id.eq.${userId || 'none'}`)
      .then(({ data }) => {
        if (data && data.length > 0) setHasVoted(true)
      })
  }, [poll.id, sessionId, userId])

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) =>
      poll.allow_multiple
        ? prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId]
        : [optionId]
    )
  }

  const handleVote = async () => {
    if (selectedOptions.length === 0 || voting) return
    setVoting(true)
    setError('')

    for (const optionId of selectedOptions) {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poll_id: poll.id, option_id: optionId, voter_session: sessionId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al votar')
        setVoting(false)
        return
      }
    }

    setHasVoted(true)
    setVoting(false)
    router.refresh()
  }

  return (
    <div className="max-w-xl mx-auto mt-8 px-6 pb-16">
      <div className="bg-paper-surface border border-paper-border p-8">
        <div className="mb-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-paper-text">{poll.title}</h1>
        </div>
        {poll.description && <p className="text-sm text-paper-muted mt-1">{poll.description}</p>}

        <div className="flex flex-wrap items-center gap-3 mt-4 mb-6 text-xs text-paper-muted">
          <span className="font-[family-name:var(--font-mono)]">{poll.profiles?.username || 'Anónimo'}</span>
          <span className="w-px h-3 bg-paper-border" />
          <span>{poll.allow_multiple ? 'Opción múltiple' : 'Una opción'}</span>
          <span className="w-px h-3 bg-paper-border" />
          <span className="font-[family-name:var(--font-mono)]">{totalVotes} voto{totalVotes !== 1 ? 's' : ''}</span>
        </div>

        {hasVoted ? (
          <div>
            <p className="font-[family-name:var(--font-mono)] text-xs text-paper-success mb-6">✔ Has votado — resultados en vivo</p>
            <PieChart options={options} totalVotes={totalVotes} />
          </div>
        ) : (
          <div>
            <p className="text-sm text-paper-text mb-3">
              {poll.allow_multiple ? 'Seleccioná una o más opciones:' : 'Elegí una opción:'}
            </p>
            <div className="space-y-2 mb-5">
              {options.map((opt) => {
                const selected = selectedOptions.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`w-full text-left border px-4 py-3 text-sm transition-colors ${
                      selected
                        ? 'border-paper-primary bg-paper-primary/5 text-paper-primary'
                        : 'border-paper-border text-paper-text hover:border-paper-text/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                        selected ? 'border-paper-primary bg-paper-primary' : 'border-paper-muted'
                      }`}>
                        {selected && <span className="text-paper-surface text-xs leading-none">✔</span>}
                      </div>
                      {opt.option_text}
                    </div>
                  </button>
                )
              })}
            </div>
            {error && (
              <div className="border border-paper-danger/30 bg-paper-danger/5 text-paper-danger text-sm px-4 py-3 mb-4">{error}</div>
            )}
            <button
              onClick={handleVote}
              disabled={selectedOptions.length === 0 || voting}
              className="w-full bg-paper-primary text-paper-surface py-3 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {voting ? 'Votando...' : 'Votar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
