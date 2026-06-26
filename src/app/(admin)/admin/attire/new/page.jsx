'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Item Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'category', label: 'Category', type: 'select', options: ['workout gear', 'casual wear', 'accessories'], required: true },
  { name: 'product_link', label: 'Product Link', type: 'text', placeholder: 'https://...' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
]

export default function NewAttire() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Attire - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = v })
      await adminCreate('attire_recommendations', payload); router.push('/admin/attire')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Attire Item" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Item" loading={loading} /></div></div>)
}
