'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getVideos } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'guest_name', label: 'Guest Name', type: 'text' },
  { name: 'category', label: 'Category', type: 'select', options: ['Workout Tutorials', 'Meal Prep', 'Coaching Tips', 'Motivational'], required: true },
  { name: 'platform', label: 'Platform', type: 'select', options: ['youtube', 'vimeo', 'self_hosted', 'other'], required: true },
  { name: 'video_id', label: 'Video ID', type: 'text', placeholder: 'YouTube/Vimeo video ID (e.g., dQw4w9WgXcQ)' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'video_file_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
]

export default function EditVideo() {
  const router = useRouter()
  const params = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const data = await getVideos()
      const found = (data || []).find((v) => v.id === params.id)
      if (!found) throw new Error('Not found')
      setItem(found)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Interview - Admin - Limitless Motion'; fetchData() }, [fetchData])

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const payload = { ...data }
      if (payload.guest_name === '') delete payload.guest_name
      if (payload.description === '') delete payload.description
      if (payload.video_file_url === '') delete payload.video_file_url
      if (payload.video_id === '') delete payload.video_id
      await adminUpdate('videos', params.id, payload)
      setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Edit Interview" /><div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" /></div>
  if (error && !item) return <div><AdminPageHeader title="Edit Interview" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title={`Edit: ${item?.title}`} description="Update interview details." />
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved successfully.</div>}
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </div>
    </div>
  )
}
