'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'], required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['cardio', 'strength', 'flexibility', 'yoga', 'hiit', 'pilates', 'dance', 'other'], required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'duration', label: 'Duration (minutes)', type: 'number' },
  { name: 'video_file_url', label: 'Video URL', type: 'text', placeholder: 'https://...' },
]

export default function NewWorkoutVideo() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'Add Workout Video - Admin - Limitless Motion' }, [])

  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}
      fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v })
      await adminCreate('workout_videos', payload)
      router.push('/admin/workout-videos')
    } catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div>
      <AdminPageHeader title="Add Workout Video" description="Upload a new workout tutorial video." />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Video" loading={loading} />
      </div>
    </div>
  )
}
