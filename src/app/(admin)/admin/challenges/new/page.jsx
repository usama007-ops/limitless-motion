'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Challenge Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { name: 'status', label: 'Status', type: 'select', options: ['active', 'upcoming', 'completed'], required: true },
  { name: 'duration', label: 'Duration (days)', type: 'number' },
  { name: 'rules', label: 'Rules', type: 'textarea', rows: 4 },
  { name: 'badge', label: 'Badge Name', type: 'text' },
  { name: 'prize', label: 'Prize', type: 'text' },
  { name: 'start_date', label: 'Start Date', type: 'date' },
  { name: 'end_date', label: 'End Date', type: 'date' },
]

export default function NewChallenge() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Challenge - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v })
      await adminCreate('workout_challenges', payload); router.push('/admin/challenges')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Challenge" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Challenge" loading={loading} /></div></div>)
}
