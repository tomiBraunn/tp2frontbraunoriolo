import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import ProjectForm from '@/components/ProjectForm'

export default async function CreateProjectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-lg mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">Crear proyecto</h1>
      <ProjectForm />
    </div>
  )
}
