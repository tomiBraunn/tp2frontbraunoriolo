'use client'

import { useRouter } from 'next/navigation'
import ResultsList from '@/components/ResultsList'

interface Option {
  id: string
  poll_id: string
  option_text: string
  created_at: string
  vote_count: number
}

interface PollData {
  id: string
  title: string
  description: string
  created_by: string
  profiles: { username: string } | null
}

export default function PollDetail({
  poll,
  options,
  totalVotes,
  userVote,
  userId,
}: {
  poll: PollData
  options: Option[]
  totalVotes: number
  userVote: string | null
  userId: string | null
}) {
  const router = useRouter()

  const handleVote = async (optionId: string) => {
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll_id: poll.id, option_id: optionId }),
    })

    if (res.ok) {
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error || 'Error al votar')
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta encuesta?')) return

    const res = await fetch('/api/polls', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poll_id: poll.id }),
    })

    if (res.ok) {
      router.push('/polls')
      router.refresh()
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      {poll.description && (
        <p className="text-gray-500 mb-4">{poll.description}</p>
      )}
      <p className="text-xs text-gray-400 mb-6">
        Creada por {poll.profiles?.username || 'Anónimo'} &middot; {totalVotes} voto{totalVotes !== 1 ? 's' : ''}
      </p>

      {userVote ? (
        <div>
          <p className="text-sm text-green-600 font-medium mb-4">Ya votaste. Resultados:</p>
          <ResultsList options={options} totalVotes={totalVotes} />
        </div>
      ) : userId ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Votá por una opción:</p>
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              className="w-full text-left border rounded-md px-4 py-3 text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              {opt.option_text}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">Iniciá sesión para votar.</p>
          <ResultsList options={options} totalVotes={totalVotes} />
        </div>
      )}

      {userId === poll.created_by && (
        <button
          onClick={handleDelete}
          className="mt-8 text-sm text-red-500 hover:text-red-700"
        >
          Eliminar encuesta
        </button>
      )}
    </div>
  )
}
