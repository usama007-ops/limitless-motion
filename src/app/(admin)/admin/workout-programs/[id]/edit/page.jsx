'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { LayoutTemplate } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import MovementBuilder from '@/components/admin/MovementBuilder'
import { getWorkoutPrograms } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Program Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { name: 'goal', label: 'Goal', type: 'select', options: ['Build Strength', 'Lose Weight', 'Improve Flexibility', 'Increase Endurance', 'General Fitness', 'Muscle Tone', 'Weight Management'], required: true },
  { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'], required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['burn', 'move', 'think', 'community', 'align'], required: true },
  { name: 'workout_type', label: 'Workout Type', type: 'select', options: ['strength', 'cardio', 'flexibility', 'mindfulness', 'mobility', 'hiit', 'functional'] },
  { name: 'session_duration', label: 'Session Duration (min)', type: 'number' },
  { name: 'target_audience', label: 'Target Audience', type: 'select', options: ['All Levels', 'Beginners', 'Intermediate', 'Advanced', 'Women', 'Men', 'Seniors'] },
  { name: 'social', label: 'Social', type: 'select', options: ['true', 'false'] },
]

export default function EditWorkoutProgram() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null); const [success, setSuccess] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)

  const fetchData = useCallback(async () => {
    try { const data = await getWorkoutPrograms(); const found = (data || []).find((v) => v.id === params.id); if (!found) throw new Error('Not found'); setItem(found) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Program - Admin - Limitless Motion'; fetchData() }, [fetchData])

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : (f.type === 'select' && (v === 'true' || v === 'false')) ? v === 'true' : v })
      await adminUpdate('workout_programs', params.id, payload); setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Edit Program" /><div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" /></div>
  if (error && !item) return <div><AdminPageHeader title="Edit Program" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title={`Edit: ${item?.name}`} description="Update workout program." />
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved successfully.</div>}
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Movement Builder</h2>
            <p className="text-sm text-muted-foreground">Manage weeks, days, and exercises for this program.</p>
          </div>
          <button
            onClick={() => setBuilderOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" /> Open Builder
          </button>
        </div>
      </div>

      <MovementBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} programId={params.id} />
    </div>
  )
}
