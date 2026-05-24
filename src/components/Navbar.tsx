'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-indigo-600">
          Encuestas
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/polls" className="text-sm text-gray-600 hover:text-gray-900">
                Encuestas
              </Link>
              <Link href="/polls/create" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">
                Nueva
              </Link>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                Iniciar sesión
              </Link>
              <Link href="/register" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
