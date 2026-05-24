'use client'

import { useActionState } from 'react'
import { createProject } from '@/app/actions/projects'

const initialState = { error: '' }

export default function ProjectForm() {
  const [state, formAction, pending] = useActionState(createProject, initialState)

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
          placeholder="Nombre del proyecto"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Describe tu proyecto..."
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
        {pending ? 'Creando...' : 'Crear proyecto'}
      </button>
    </form>
  )
}
