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

export async function PUT(request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { table, id, data } = await request.json()

    if (!table || !id || !data) {
      return NextResponse.json({ error: 'Table, id, and data are required' }, { status: 400 })
    }

    const admin = getAdminClient()
    const { data: record, error } = await admin.from(table).update(data).eq('id', id).select().single()
    if (error) throw error

    return NextResponse.json({ record })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
