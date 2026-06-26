'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'goal', label: 'Goal', type: 'text' },
  { name: 'story_type', label: 'Story Type', type: 'text' },
  { name: 'results_summary', label: 'Results Summary', type: 'textarea', rows: 3 },
  { name: 'testimonial', label: 'Testimonial', type: 'textarea', rows: 4 },
  { name: 'timeline_category', label: 'Timeline', type: 'select', options: ['8-12 weeks', '12-16 weeks', '16+ weeks'] },
  { name: 'timeline_weeks', label: 'Timeline (weeks)', type: 'number' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'gender', label: 'Gender', type: 'text' },
  { name: 'workout_consistency', label: 'Workout Consistency', type: 'text' },
  { name: 'before_photo_url', label: 'Before Photo URL', type: 'text', placeholder: 'https://...' },
  { name: 'after_photo_url', label: 'After Photo URL', type: 'text', placeholder: 'https://...' },
  { name: 'metrics', label: 'Metrics (JSON)', type: 'json', rows: 4, helpText: 'e.g. {"weight_lost": 20, "body_fat_percent_change": 5}' },
  { name: 'milestones', label: 'Milestones (JSON)', type: 'json', rows: 4, helpText: 'Array of milestone strings' },
]

export default function NewSuccessStory() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Story - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : f.type === 'json' ? (typeof v === 'string' ? JSON.parse(v) : v) : v })
      await adminCreate('success_stories', payload); router.push('/admin/success-stories')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Success Story" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Story" loading={loading} /></div></div>)
}
