'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getPodcasts } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Podcast Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'platform', label: 'Platform', type: 'select', options: ['Spotify', 'Apple Podcasts', 'YouTube', 'Other'], required: true },
  { name: 'podcast_link', label: 'Podcast Link', type: 'text', placeholder: 'https://...' },
  { name: 'speaker_name', label: 'Speaker Name', type: 'text' },
  { name: 'duration', label: 'Duration (minutes)', type: 'number' },
  { name: 'audio_file_url', label: 'Audio File URL', type: 'text', placeholder: 'https://...' },
]

export default function EditPodcast() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null); const [success, setSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    try { const data = await getPodcasts(); const found = (data || []).find((v) => v.id === params.id); if (!found) throw new Error('Not found'); setItem(found) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Podcast - Admin - Limitless Motion'; fetchData() }, [fetchData])

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v })
      await adminUpdate('podcasts', params.id, payload); setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Edit Podcast" /><div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" /></div>
  if (error && !item) return <div><AdminPageHeader title="Edit Podcast" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title={`Edit: ${item?.name}`} description="Update podcast details." />
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved successfully.</div>}
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </div>
    </div>
  )
}
