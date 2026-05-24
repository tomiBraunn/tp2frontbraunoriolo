'use client'

import { useActionState } from 'react'
import { use } from 'react'
import { updateProject } from '@/app/actions/projects'
import { createClient } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

const initialState = { error: '' }

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [state, formAction, pending] = useActionState(updateProject, initialState)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setTitle(data.title)
        setDescription(data.description || '')
      }
    })
  }, [id])

  return (
    <div className="max-w-lg mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Editar proyecto</h1>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="projectId" value={id} />
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
