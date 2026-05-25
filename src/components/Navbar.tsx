'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-paper-surface border-b border-paper-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-[family-name:var(--font-display)] font-bold text-lg text-paper-primary tracking-tight">
          Tinta
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/polls" className="text-sm text-paper-muted hover:text-paper-primary transition-colors px-3 py-1.5">
            Explorar
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-paper-muted hover:text-paper-primary transition-colors px-3 py-1.5">
                Dashboard
              </Link>
              <Link
                href="/polls/create"
                className="text-sm bg-paper-primary text-paper-surface px-4 py-1.5 hover:opacity-80 transition-opacity"
              >
                + Nueva
              </Link>
              <button onClick={handleLogout} className="text-sm text-paper-muted hover:text-paper-danger transition-colors px-3 py-1.5">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-paper-muted hover:text-paper-primary transition-colors px-3 py-1.5">
                Ingresar
              </Link>
              <Link
                href="/register"
                className="text-sm bg-paper-primary text-paper-surface px-4 py-1.5 hover:opacity-80 transition-opacity"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
