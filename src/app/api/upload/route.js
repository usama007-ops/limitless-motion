import { NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_PUBLIC_URL, R2_BUCKET } from '@/lib/r2Client'
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

export async function POST(request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const formData = await request.formData()
    const file = formData.get('file')
    const table = formData.get('table')
    const recordId = formData.get('recordId')
    const fileField = formData.get('fileField') || 'file_url'

    if (!file || !table) {
      return NextResponse.json({ error: 'File and table are required' }, { status: 400 })
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Invalid file upload' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const key = `uploads/${table}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }))

    const publicUrl = `${R2_PUBLIC_URL}/${key}`

    const supabase = getAdminClient()
    const metadata = {}

    if (recordId) {
      metadata[fileField] = publicUrl
      await supabase.from(table).update(metadata).eq('id', recordId)
    } else {
      for (const [key, value] of formData.entries()) {
        if (!['file', 'table', 'recordId', 'fileField'].includes(key)) {
          metadata[key] = value
        }
      }
      metadata[fileField] = publicUrl
      const { data, error } = await supabase.from(table).insert(metadata).select().single()
      if (error) throw error
      return NextResponse.json({ url: publicUrl, record: data })
    }

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
