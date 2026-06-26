'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Podcast Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'platform', label: 'Platform', type: 'select', options: ['Spotify', 'Apple Podcasts', 'YouTube', 'Other'], required: true },
  { name: 'podcast_link', label: 'Podcast Link', type: 'text', placeholder: 'https://...' },
  { name: 'speaker_name', label: 'Speaker Name', type: 'text' },
  { name: 'duration', label: 'Duration (minutes)', type: 'number' },
  { name: 'audio_file_url', label: 'Audio File URL', type: 'text', placeholder: 'https://...' },
]

export default function NewPodcast() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'Add Podcast - Admin - Limitless Motion' }, [])

  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}
      fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v })
      await adminCreate('podcasts', payload)
      router.push('/admin/podcasts')
    } catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div>
      <AdminPageHeader title="Add External Podcast" description="Link to a podcast on Spotify, Apple Podcasts, etc." />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Podcast" loading={loading} />
      </div>
    </div>
  )
}
