'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'

const initialState = { error: '' }

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signup, initialState)

  return (
    <div className="max-w-sm mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Registrarse</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {pending ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
