'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getExercises, getWorkoutPrograms, getWorkoutDays } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

export default function EditExercise() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null); const [success, setSuccess] = useState(false)
  const [programs, setPrograms] = useState([])
  const [days, setDays] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [formReady, setFormReady] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [exData, progData] = await Promise.all([getExercises(), getWorkoutPrograms()])
      const found = (exData || []).find(v => v.id === params.id)
      if (!found) throw new Error('Not found')
      setItem(found)
      setPrograms(progData || [])
      setSelectedProgram(found.program_id || '')
      setSelectedDay(found.day_id || '')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Movement - Admin - Limitless Motion'; fetchData() }, [fetchData])

  useEffect(() => {
    if (!selectedProgram) { setDays([]); setFormReady(true); return }
    getWorkoutDays(selectedProgram).then(d => {
      setDays(d || [])
      setFormReady(true)
    }).catch(() => { setDays([]); setFormReady(true) })
  }, [selectedProgram])

  const fields = [
    { name: 'exercise_name', label: 'Movement Name', type: 'text', required: true },
    { name: 'sets', label: 'Sets', type: 'number' },
    { name: 'reps', label: 'Reps / Time', type: 'text' },
    { name: 'muscle_groups', label: 'Focus Area', type: 'text' },
    { name: 'form_tips', label: 'Form Tips', type: 'textarea', rows: 2 },
  ]

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
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
      await adminUpdate('exercises', params.id, payload); setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Edit Movement" /><div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" /></div>
  if (error && !item) return <div><AdminPageHeader title="Edit Movement" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title={`Edit: ${item?.exercise_name}`} />
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved successfully.</div>}
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
        {formReady && item && (
          <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
        )}
      </div>
    </div>
  )
}
