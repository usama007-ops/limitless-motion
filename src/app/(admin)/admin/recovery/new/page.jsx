'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'type', label: 'Type', type: 'select', options: ['stretch', 'mobility', 'breathing'], required: true },
  { name: 'duration', label: 'Duration (minutes)', type: 'number' },
  { name: 'instructions', label: 'Instructions', type: 'textarea', rows: 6 },
  { name: 'stretches', label: 'Stretches/Exercises (JSON)', type: 'json', rows: 6, helpText: 'Array of objects with name, duration, instructions' },
]

export default function NewRecovery() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Recovery Flow - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : f.type === 'json' ? (typeof v === 'string' ? JSON.parse(v) : v) : v })
      await adminCreate('recovery_flows', payload); router.push('/admin/recovery')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Recovery Flow" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Flow" loading={loading} /></div></div>)
}
