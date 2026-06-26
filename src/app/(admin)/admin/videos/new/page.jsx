'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'guest_name', label: 'Guest Name', type: 'text' },
  { name: 'category', label: 'Category', type: 'select', options: ['Workout Tutorials', 'Meal Prep', 'Coaching Tips', 'Motivational'], required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'video_file_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
]

export default function NewVideo() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    document.title = 'Add Interview - Admin - Limitless Motion'
  }, [])

  async function handleSubmit(data) {
    setLoading(true)
    setError(null)
    try {
      const payload = { ...data }
      if (payload.guest_name === '') delete payload.guest_name
      if (payload.description === '') delete payload.description
      if (payload.video_file_url === '') delete payload.video_file_url
      await adminCreate('videos', payload)
      router.push('/admin/videos')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <AdminPageHeader title="Add Interview Episode" description="Upload a new podcast interview video." />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Episode" loading={loading} />
      </div>
    </div>
  )
}
