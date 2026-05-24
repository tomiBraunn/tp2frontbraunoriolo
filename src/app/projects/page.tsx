import { createClient } from '@/lib/supabaseServer'
import ProjectCard from '@/components/ProjectCard'
import type { Project } from '@/types'

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(username)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Proyectos</h1>
      {!projects || projects.length === 0 ? (
        <p className="text-gray-500">No hay proyectos todavía.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project as Project} />
          ))}
        </div>
      )}
    </div>
  )
}
