'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'text', label: 'Affirmation Text', type: 'textarea', required: true, rows: 3 },
]

export default function NewAffirmation() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { document.title = 'Add Affirmation - Admin - Limitless Motion' }, [])

  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = { text: data.text }
      await adminCreate('affirmations', payload)
      router.push('/admin/affirmations')
    } catch (err) { setError(err.message); setLoading(false) }
  }

  return (
    <div>
      <AdminPageHeader title="Add Affirmation" description="Create a new daily affirmation." />
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Affirmation" loading={loading} />
      </div>
    </div>
  )
}
