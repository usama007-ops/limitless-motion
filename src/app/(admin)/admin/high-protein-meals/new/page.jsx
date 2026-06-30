'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Meal Name', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'category', label: 'Category', type: 'select', options: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  { name: 'ingredients', label: 'Ingredients', type: 'repeater', itemLabel: 'Ingredient', itemType: 'simple' },
  { name: 'instructions', label: 'Instructions', type: 'textarea', rows: 6 },
  { name: 'protein_grams', label: 'Protein (g)', type: 'number' },
  { name: 'calories_total', label: 'Calories', type: 'number' },
  { name: 'carbs_grams', label: 'Carbs (g)', type: 'number' },
  { name: 'fats_grams', label: 'Fats (g)', type: 'number' },
  { name: 'prep_time_minutes', label: 'Prep Time (min)', type: 'number' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
]

export default function NewHighProteinMeal() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New High Protein Meal - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v })
      await adminCreate('high_protein_meals', payload); router.push('/admin/high-protein-meals')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New High Protein Meal" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Meal" loading={loading} /></div></div>)
}
