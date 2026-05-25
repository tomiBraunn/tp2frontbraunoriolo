'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function signup(prevState: { error: string }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!email || !password || !username) {
    return { error: 'All fields are required' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user && !data.user.email_confirmed_at) {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (serviceRoleKey && supabaseUrl) {
      const adminClient = createAdminClient(supabaseUrl, serviceRoleKey)
      await adminClient.auth.admin.updateUserById(data.user.id, { email_confirm: true })
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function login(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

      if (serviceRoleKey && supabaseUrl) {
        const adminClient = createAdminClient(supabaseUrl, serviceRoleKey)
        const { data: usersData } = await adminClient.auth.admin.listUsers()
        const user = usersData?.users?.find((u) => u.email === data.email)

        if (user) {
          await adminClient.auth.admin.updateUserById(user.id, { email_confirm: true })
          const { error: retryError } = await supabase.auth.signInWithPassword(data)
          if (!retryError) {
            revalidatePath('/', 'layout')
            redirect('/dashboard')
          }
        }
      }
    }

    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
