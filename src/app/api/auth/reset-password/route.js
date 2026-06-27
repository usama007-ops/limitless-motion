import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseClient'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/update-password`,
    })

    if (error) throw error
    return NextResponse.json({ sent: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
