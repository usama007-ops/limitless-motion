'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { getAffirmations } from '@/db'
import { adminUpdate } from '@/lib/adminDb'

const fields = [
  { name: 'text', label: 'Affirmation Text', type: 'textarea', rows: 3, required: true },
]

export default function EditAffirmation() {
  const router = useRouter(); const params = useParams()
  const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null); const [success, setSuccess] = useState(false)

  const fetchData = useCallback(async () => {
    try { const data = await getAffirmations(); const found = (data || []).find((v) => v.id === params.id); if (!found) throw new Error('Not found'); setItem(found) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { document.title = 'Edit Affirmation - Admin - Limitless Motion'; fetchData() }, [fetchData])

  async function handleSubmit(data) {
    setSaving(true); setError(null); setSuccess(false)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = v })
      await adminUpdate('affirmations', params.id, payload); setSuccess(true)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Edit Affirmation" /><div className="animate-pulse bg-card border border-border rounded-lg p-6 h-64" /></div>
  if (error && !item) return <div><AdminPageHeader title="Edit Affirmation" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title={`Edit: "${item?.text?.slice(0, 40)}..."`} />
      {success && <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">Saved successfully.</div>}
      {error && <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">{error}</div>}
      <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
        <AdminForm fields={fields} initialValues={item} onSubmit={handleSubmit} submitLabel="Save Changes" loading={saving} />
      </div>
    </div>
  )
}
