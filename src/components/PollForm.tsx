'use client'

import { useActionState } from 'react'
import { createPoll } from '@/app/actions/polls'

const initialState = { error: '' }

export default function PollForm() {
  const [state, formAction, pending] = useActionState(createPoll, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-paper-text mb-1.5">Título</label>
        <input
          id="title" name="title" required placeholder="ej. ¿Cuál es tu lenguaje favorito?"
          className="w-full border border-paper-border bg-paper-surface px-4 py-2.5 text-sm text-paper-text placeholder:text-paper-muted/50 focus:outline-none focus:border-paper-primary transition-colors"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-paper-text mb-1.5">Descripción</label>
        <textarea
          id="description" name="description" rows={2} placeholder="Contale de qué trata tu encuesta..."
          className="w-full border border-paper-border bg-paper-surface px-4 py-2.5 text-sm text-paper-text placeholder:text-paper-muted/50 focus:outline-none focus:border-paper-primary transition-colors resize-none"
        />
      </div>
      <div>
        <label htmlFor="options" className="block text-sm font-medium text-paper-text mb-1.5">Opciones</label>
        <input
          id="options" name="options" required placeholder="JavaScript, Python, Rust, Go"
          className="w-full border border-paper-border bg-paper-surface px-4 py-2.5 text-sm text-paper-text placeholder:text-paper-muted/50 focus:outline-none focus:border-paper-primary transition-colors"
        />
        <p className="text-xs text-paper-muted mt-1.5 font-[family-name:var(--font-mono)]">Separadas por coma</p>
      </div>
      <label className="flex items-center gap-3 border border-paper-border p-3 cursor-pointer hover:bg-paper-subtle transition-colors">
        <input id="allowMultiple" name="allowMultiple" type="checkbox" className="w-4 h-4 accent-paper-primary" />
        <div>
          <span className="text-sm font-medium text-paper-text">Permitir voto múltiple</span>
          <p className="text-xs text-paper-muted">Los votantes podrán elegir más de una opción</p>
        </div>
      </label>
      {state?.error && (
        <div className="border border-paper-danger/30 bg-paper-danger/5 text-paper-danger text-sm px-4 py-3">{state.error}</div>
      )}
      <button
        type="submit" disabled={pending}
        className="w-full bg-paper-primary text-paper-surface py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {pending ? 'Creando encuesta...' : 'Crear encuesta'}
      </button>
    </form>
  )
}
