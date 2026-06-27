'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

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

export default function NewWorkoutProgram() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'New Program - Admin - Limitless Motion' }, [])

  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}
      fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : f.type === 'select' && (v === 'true' || v === 'false') ? v === 'true' : v })
      await adminCreate('workout_programs', payload)
      router.push('/admin/workout-programs')
    } catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div>
      <AdminPageHeader title="New Workout Program" description="Create a new workout program." />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Program" loading={loading} />
      </div>
    </div>
  )
}
