'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'

const initialState = { error: '' }

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signup, initialState)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-paper-surface border border-paper-border p-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-paper-text text-center mb-1">Crear cuenta</h1>
          <p className="text-sm text-paper-muted text-center mb-8">Empezá a crear encuestas</p>
          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-paper-text mb-1.5">Usuario</label>
              <input id="username" name="username" required
                className="w-full border border-paper-border bg-paper-surface px-4 py-2.5 text-sm text-paper-text placeholder:text-paper-muted/50 focus:outline-none focus:border-paper-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-paper-text mb-1.5">Email</label>
              <input id="email" name="email" type="email" required
                className="w-full border border-paper-border bg-paper-surface px-4 py-2.5 text-sm text-paper-text placeholder:text-paper-muted/50 focus:outline-none focus:border-paper-primary transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-paper-text mb-1.5">Contraseña</label>
              <input id="password" name="password" type="password" required
                className="w-full border border-paper-border bg-paper-surface px-4 py-2.5 text-sm text-paper-text placeholder:text-paper-muted/50 focus:outline-none focus:border-paper-primary transition-colors"
              />
            </div>
            {state?.error && (
              <div className="border border-paper-danger/30 bg-paper-danger/5 text-paper-danger text-sm px-4 py-3">{state.error}</div>
            )}
            <button type="submit" disabled={pending}
              className="w-full bg-paper-primary text-paper-surface py-2.5 text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {pending ? 'Registrando...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="text-center text-sm text-paper-muted mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-paper-primary underline underline-offset-2 hover:opacity-70 transition-opacity">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
