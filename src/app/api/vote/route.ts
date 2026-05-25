import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { poll_id, option_id, voter_session } = await request.json()

  const { data: poll } = await supabase
    .from('polls')
    .select('allow_multiple')
    .eq('id', poll_id)
    .single()

  if (!poll) {
    return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
  }

  if (!poll.allow_multiple) {
    const { data: existing } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', poll_id)
      .or(`voter_session.eq.${voter_session},voter_id.eq.${user?.id || 'none'}`)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Ya votaste en esta encuesta' }, { status: 400 })
    }
  }

  const { error } = await supabase
    .from('votes')
    .insert({ poll_id, option_id, voter_id: user?.id || null, voter_session })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
