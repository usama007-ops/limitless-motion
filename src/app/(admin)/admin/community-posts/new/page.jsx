'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'
import { useAuth } from '@/contexts/AuthContext.jsx'

const fields = [
  { name: 'type', label: 'Type', type: 'select', options: ['success story', 'progress update', 'motivation', 'workout win'], required: true },
  { name: 'content', label: 'Content', type: 'textarea', rows: 4, required: true },
  { name: 'author_name', label: 'Author Name', type: 'text' },
  { name: 'likes', label: 'Likes', type: 'number' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
]

export default function NewCommunityPost() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'New Post - Admin - Limitless Motion' }, [])

  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = { author_id: currentUser?.id }
      fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v })
      await adminCreate('community_posts', payload)
      router.push('/admin/community-posts')
    } catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div>
      <AdminPageHeader title="New Community Post" description="Create a new community post." />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Post" loading={loading} />
      </div>
    </div>
  )
}
