'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export async function createPoll(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const optionsRaw = formData.get('options') as string

  if (!title || !optionsRaw) {
    return { error: 'Title and options are required' }
  }

  const options = optionsRaw.split(',').map(o => o.trim()).filter(Boolean)

  if (options.length < 2) {
    return { error: 'At least 2 options are required' }
  }

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ title, description, created_by: user.id })
    .select()
    .single()

  if (pollError) {
    return { error: pollError.message }
  }

  const pollOptions = options.map(option_text => ({
    poll_id: poll.id,
    option_text,
  }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(pollOptions)

  if (optionsError) {
    return { error: optionsError.message }
  }

  revalidatePath('/polls')
  redirect(`/polls/${poll.id}`)
}

export async function vote(pollId: string, optionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('votes')
    .insert({ poll_id: pollId, option_id: optionId, user_id: user.id })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/polls/${pollId}`)
}

export async function deletePoll(pollId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', pollId)
    .eq('created_by', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/polls')
  redirect('/polls')
}
