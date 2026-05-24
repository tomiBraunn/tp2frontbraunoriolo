import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: myPolls } = await supabase
    .from('polls')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', user.id)

  const { count: myVotes } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-2">Bienvenido, {profile?.username || user.email}</h1>
      <p className="text-gray-500 mb-8">Panel de control</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg border p-6 text-center">
          <p className="text-3xl font-bold text-indigo-600">{myPolls || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Encuestas creadas</p>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <p className="text-3xl font-bold text-indigo-600">{myVotes || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Votos emitidos</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link
          href="/polls/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
        >
          Crear encuesta
        </Link>
        <Link
          href="/polls"
          className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md text-sm hover:bg-indigo-50"
        >
          Ver encuestas
        </Link>
      </div>
    </div>
  )
}
