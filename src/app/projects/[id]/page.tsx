import { createClient } from '@/lib/supabaseServer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { deleteProject } from '@/app/actions/projects'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, profiles(username)')
    .eq('id', id)
    .single()

  if (!project) {
    notFound()
  }

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === project.created_by

  return (
    <div className="max-w-lg mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      {project.description && (
        <p className="text-gray-500 mb-4">{project.description}</p>
      )}
      <p className="text-xs text-gray-400 mb-6">
        Creado por {project.profiles?.username || 'Anónimo'} &middot; {new Date(project.created_at).toLocaleDateString('es-AR')}
      </p>

      {isOwner && (
        <div className="flex gap-3">
          <Link
            href={`/projects/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
          >
            Editar
          </Link>
          <form action={async (formData: FormData) => { formData.set('projectId', id); await deleteProject({ error: '' }, formData) }}>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
              onClick={(e) => { if (!confirm('¿Eliminar este proyecto?')) e.preventDefault() }}
            >
              Eliminar
            </button>
          </form>
        </div>
      )}

      <Link href="/projects" className="block mt-8 text-sm text-gray-400 hover:text-gray-600">
        ← Volver a proyectos
      </Link>
    </div>
  )
}
