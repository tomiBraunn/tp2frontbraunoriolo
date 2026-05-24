'use client'

import { useActionState } from 'react'
import { createPoll } from '@/app/actions/polls'

const initialState = { error: '' }

export default function PollForm() {
  const [state, formAction, pending] = useActionState(createPoll, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="¿Cuál es tu preferencia?"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe tu encuesta..."
        />
      </div>
      <div>
        <label htmlFor="options" className="block text-sm font-medium text-gray-700 mb-1">
          Opciones (separadas por coma)
        </label>
        <input
          id="options"
          name="options"
          required
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Opción A, Opción B, Opción C"
        />
      </div>
      {state?.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
      >
        {pending ? 'Creando...' : 'Crear encuesta'}
      </button>
    </form>
  )
}
