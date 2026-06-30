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

export async function POST(request) {
  try {
    const supabase = await getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const admin = getAdminClient()

    const { data, error } = await admin.from('success_stories').insert({
      name: body.name,
      age: Number(body.age) || 1,
      gender: body.gender || '',
      goal: body.goal,
      results_summary: body.results_summary || '',
      timeline_weeks: Number(body.timeline_weeks) || 1,
      testimonial: body.testimonial,
      workout_consistency: Number(body.workout_consistency) || 0,
      story_type: body.story_type || 'Weight Loss',
      timeline_category: body.timeline_category || '12-16 weeks',
      before_photo_url: body.before_photo_url || '',
      after_photo_url: body.after_photo_url || '',
      metrics: body.metrics || [],
      milestones: body.milestones || [],
    }).select().single()

    if (error) throw error

    return NextResponse.json({ story: data })
  } catch (error) {
    console.error('Create success story error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
