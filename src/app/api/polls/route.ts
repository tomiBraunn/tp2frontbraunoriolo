import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { poll_id } = await request.json()

  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', poll_id)
    .eq('created_by', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
