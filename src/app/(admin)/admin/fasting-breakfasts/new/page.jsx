'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Breakfast Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'category', label: 'Category', type: 'select', options: ['ethiopian', 'global'] },
  { name: 'ingredients', label: 'Ingredients (JSON)', type: 'json', rows: 5 },
  { name: 'instructions', label: 'Instructions', type: 'textarea', rows: 6 },
  { name: 'calories_total', label: 'Calories', type: 'number' },
  { name: 'protein_grams', label: 'Protein (g)', type: 'number' },
  { name: 'fiber_grams', label: 'Fiber (g)', type: 'number' },
  { name: 'prep_time_minutes', label: 'Prep Time (min)', type: 'number' },
  { name: 'cook_time_minutes', label: 'Cook Time (min)', type: 'number' },
  { name: 'is_featured', label: 'Featured', type: 'select', options: ['true', 'false'] },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
]

export default function NewFastingBreakfast() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Fasting Breakfast - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : (f.type === 'select' && (v === 'true' || v === 'false')) ? v === 'true' : (f.type === 'json') ? (typeof v === 'string' ? JSON.parse(v) : v) : v })
      await adminCreate('fasting_breakfasts', payload); router.push('/admin/fasting-breakfasts')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Fasting Breakfast" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Breakfast" loading={loading} /></div></div>)
}
