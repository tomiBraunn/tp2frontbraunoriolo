import Link from 'next/link'
import type { Project } from '@/types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-white rounded-lg border p-5 hover:shadow-md transition-shadow">
        <h2 className="font-semibold text-lg mb-1">{project.title}</h2>
        {project.description && (
          <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          {project.profiles?.username || 'Anónimo'} &middot; {new Date(project.created_at).toLocaleDateString('es-AR')}
        </p>
      </div>
    </Link>
  )
}
