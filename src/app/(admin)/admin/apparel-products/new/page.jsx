'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Product Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
  { name: 'in_stock', label: 'In Stock', type: 'select', options: ['true', 'false'] },
]

export default function NewApparelProduct() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Product - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : (f.type === 'select' && (v === 'true' || v === 'false')) ? v === 'true' : v })
      await adminCreate('apparel_products', payload); router.push('/admin/apparel-products')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Apparel Product" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Product" loading={loading} /></div></div>)
}
