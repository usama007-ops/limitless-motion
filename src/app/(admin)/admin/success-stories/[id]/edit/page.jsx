'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getSuccessStories } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'goal', label: 'Goal', type: 'select', options: ['Weight Loss', 'Muscle Gain', 'Overall Health', 'Strength', 'Endurance', 'Flexibility', 'Transformation'] },
  { name: 'story_type', label: 'Story Type', type: 'select', options: ['Weight Loss', 'Strength', 'Health', 'Confidence', 'Athletic Performance', 'Postpartum Recovery'] },
  { name: 'results_summary', label: 'Results Summary', type: 'textarea', rows: 3 },
  { name: 'testimonial', label: 'Testimonial', type: 'textarea', rows: 4 },
  { name: 'timeline_category', label: 'Timeline', type: 'select', options: ['8-12 weeks', '12-16 weeks', '16+ weeks'] },
  { name: 'timeline_weeks', label: 'Timeline (weeks)', type: 'number' },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
  { name: 'workout_consistency', label: 'Workout Consistency (0-100)', type: 'number', helpText: 'Percentage value between 0 and 100' },
  { name: 'before_photo_url', label: 'Before Photo URL', type: 'text', placeholder: 'https://...' },
  { name: 'after_photo_url', label: 'After Photo URL', type: 'text', placeholder: 'https://...' },
  { name: 'metrics', label: 'Metrics (JSON)', type: 'json', rows: 4 },
  { name: 'milestones', label: 'Milestones (JSON)', type: 'json', rows: 4 },
]

export default function EditSuccessStory() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null); const [success, setSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    try { const data = await getSuccessStories(); const found = (data || []).find((v) => v.id === params.id); if (!found) throw new Error('Not found'); setItem(found) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Story - Admin - Limitless Motion'; fetchData() }, [fetchData])

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : f.type === 'json' ? (typeof v === 'string' ? JSON.parse(v) : v) : v })
      await adminUpdate('success_stories', params.id, payload); setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Edit Story" /><div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" /></div>
  if (error && !item) return <div><AdminPageHeader title="Edit Story" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title={`Edit: ${item?.name}`} />
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved successfully.</div>}
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </div>
    </div>
  )
}
