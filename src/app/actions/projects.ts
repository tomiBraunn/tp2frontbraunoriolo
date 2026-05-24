'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export async function createProject(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''

  if (!title) {
    return { error: 'Title is required' }
  }

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ title, description, created_by: user.id })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  redirect(`/projects/${project.id}`)
}

export async function updateProject(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const projectId = formData.get('projectId') as string
  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''

  if (!projectId || !title) {
    return { error: 'Project ID and title are required' }
  }

  const { error } = await supabase
    .from('projects')
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/projects/${projectId}`)
  redirect(`/projects/${projectId}`)
}

export async function deleteProject(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const projectId = formData.get('projectId') as string

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/projects')
  redirect('/projects')
}
