import { createClient } from '@/lib/supabaseServerClient'
import { redirect } from 'next/navigation'

export async function getCurrentProfile() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return {
    ...session.user,
    ...profile,
  }
}

export async function requireAuth(redirectTo = '/login') {
  const user = await getCurrentProfile()
  if (!user) {
    redirect(redirectTo)
  }
  return user
}

export async function requirePremium(redirectTo = '/membership-upgrade') {
  const user = await requireAuth()
  if (!user.is_premium) {
    redirect(redirectTo)
  }
  return user
}

export async function requireAdmin(redirectTo = '/dashboard') {
  const user = await requireAuth()
  if (user.role !== 'admin') {
    redirect(redirectTo)
  }
  return user
}
