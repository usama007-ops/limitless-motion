import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabaseAdmin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

async function requireAdmin() {
  const supabase = await getSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  if (profile?.role !== 'admin') return null
  return true
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = getAdminClient()

    const [
      { count: totalUsers },
      { count: totalMemberships },
      { count: pendingBookings },
      { count: totalPosts },
      { count: totalWorkoutPrograms },
      { count: totalMealRecipes },
    ] = await Promise.all([
      admin.from('profiles').select('*', { count: 'exact', head: true }),
      admin.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      admin.from('coaching_bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      admin.from('community_posts').select('*', { count: 'exact', head: true }),
      admin.from('workout_programs').select('*', { count: 'exact', head: true }),
      admin.from('meal_recipes').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeMemberships: totalMemberships || 0,
      pendingBookings: pendingBookings || 0,
      totalPosts: totalPosts || 0,
      totalWorkoutPrograms: totalWorkoutPrograms || 0,
      totalMealRecipes: totalMealRecipes || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
