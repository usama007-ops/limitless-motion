'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getWorkoutPrograms, getWorkoutDays } from '@/db'
import { adminCreate } from '@/lib/adminDb'

export default function NewExercise() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [programs, setPrograms] = useState([])
  const [days, setDays] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  useEffect(() => {
    document.title = 'New Movement - Admin - Limitless Motion'
    getWorkoutPrograms().then(d => {
      if (d) setPrograms(d)
      if (d && d.length > 0) setSelectedProgram(d[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedProgram) { setDays([]); return }
    getWorkoutDays(selectedProgram).then(d => {
      setDays(d || [])
      setSelectedDay('')
    }).catch(() => setDays([]))
  }, [selectedProgram])

  const fields = [
    { name: 'exercise_name', label: 'Movement Name', type: 'text', required: true },
    { name: 'sets', label: 'Sets', type: 'number' },
    { name: 'reps', label: 'Reps / Time', type: 'text' },
    { name: 'muscle_groups', label: 'Focus Area', type: 'text' },
    { name: 'form_tips', label: 'Form Tips', type: 'textarea', rows: 2 },
  ]

  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {
        program_id: selectedProgram,
        day_id: selectedDay || null,
        exercise_name: data.exercise_name,
        sets: Number(data.sets) || 3,
        reps: data.reps || '',
        muscle_groups: data.muscle_groups || '',
        form_tips: data.form_tips || '',
      }
      await adminCreate('exercises', payload)
      router.push('/admin/exercises')
    } catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div>
      <AdminPageHeader title="New Movement" />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Program *</label>
          <select
            value={selectedProgram}
            onChange={e => setSelectedProgram(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
          >
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Day</label>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
          >
            <option value="">-- No day assigned --</option>
            {days.map(d => (
              <option key={d.id} value={d.id}>{d.day_name}</option>
            ))}
          </select>
        </div>
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Movement" loading={loading} />
      </div>
    </div>
  )
}
