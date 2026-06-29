'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getExercises } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'exercise_name', label: 'Movement Name', type: 'text', required: true },
  { name: 'sets', label: 'Sets', type: 'number' },
  { name: 'reps', label: 'Reps / Time', type: 'text' },
  { name: 'muscle_groups', label: 'Focus Area', type: 'text' },
  { name: 'form_tips', label: 'Form Tips', type: 'textarea', rows: 2 },
]

export default function EditExercise() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null); const [success, setSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const exData = await getExercises()
      const found = (exData || []).find(v => v.id === params.id)
      if (!found) throw new Error('Not found')
      setItem(found)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Movement - Admin - Limitless Motion'; fetchData() }, [fetchData])

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const payload = {
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
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved.</div>}
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </div>
    </div>
  )
}
