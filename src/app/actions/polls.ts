'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import { parseOptions, validatePollInput, getUsername } from '@/lib/pollUtils'

export async function createPoll(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Ensure user profile exists before creating poll
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!profile) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username: getUsername(user.email, user.user_metadata?.username)
      })

    if (profileError) {
      return { error: `Failed to create profile: ${profileError.message}` }
    }
  }

  const title = formData.get('title') as string
  const description = (formData.get('description') as string) || ''
  const optionsRaw = formData.get('options') as string
  const allowMultiple = formData.get('allowMultiple') === 'on'

  const validationError = validatePollInput(title, optionsRaw)
  if (validationError) return { error: validationError }

  const options = parseOptions(optionsRaw)

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ title, description, created_by: user.id, allow_multiple: allowMultiple })
    .select()
    .single()

  if (pollError) {
    return { error: pollError.message }
  }

  const pollOptions = options.map(option_text => ({ poll_id: poll.id, option_text }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(pollOptions)

  if (optionsError) {
    return { error: optionsError.message }
  }

  revalidatePath('/polls')
  redirect(`/polls/${poll.id}`)
}

export async function vote(pollId: string, optionId: string, voterSession: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: poll } = await supabase
    .from('polls')
    .select('allow_multiple')
    .eq('id', pollId)
    .single()

  if (!poll) {
    return { error: 'Poll not found' }
  }

  if (!poll.allow_multiple) {
    const { data: existing } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .or(`voter_session.eq.${voterSession},voter_id.eq.${user?.id || 'none'}`)
      .maybeSingle()

    if (existing) {
      return { error: 'Ya votaste en esta encuesta' }
    }
  }

  const { error } = await supabase
    .from('votes')
    .insert({
      poll_id: pollId,
      option_id: optionId,
      voter_id: user?.id || null,
      voter_session: voterSession,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/polls/${pollId}`)
}

export async function deletePoll(pollId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('polls').delete().eq('id', pollId).eq('created_by', user.id)

  revalidatePath('/polls')
  redirect('/polls')
}
