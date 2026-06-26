'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import { adminCreate } from '@/lib/adminDb'

const fields = [
  { name: 'name', label: 'Recipe Name', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'select', options: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  { name: 'season', label: 'Season', type: 'select', options: ['fasting', 'non-fasting', 'both'] },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'ingredients', label: 'Ingredients (JSON)', type: 'json', rows: 5, helpText: 'Array of ingredient strings' },
  { name: 'instructions', label: 'Instructions', type: 'textarea', rows: 6 },
  { name: 'calories_total', label: 'Calories', type: 'number' },
  { name: 'protein_grams', label: 'Protein (g)', type: 'number' },
  { name: 'carbs_grams', label: 'Carbs (g)', type: 'number' },
  { name: 'fats_grams', label: 'Fats (g)', type: 'number' },
  { name: 'prep_time_minutes', label: 'Prep Time (min)', type: 'number' },
  { name: 'cook_time_minutes', label: 'Cook Time (min)', type: 'number' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
]

export default function NewMealRecipe() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null)
  useEffect(() => { document.title = 'New Recipe - Admin - Limitless Motion' }, [])
  async function handleSubmit(data) {
    setLoading(true); setError(null)
    try {
      const payload = {}; fields.forEach((f) => { const v = data[f.name]; if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : f.type === 'json' ? (typeof v === 'string' ? JSON.parse(v) : v) : v })
      await adminCreate('meal_recipes', payload); router.push('/admin/meal-recipes')
    } catch (err) { setError(err.message); setLoading(false) }
  }
  return (<div><AdminPageHeader title="New Meal Recipe" /><div className="bg-card border border-border rounded-lg p-6 max-w-2xl"><AdminForm fields={fields} onSubmit={handleSubmit} submitLabel="Create Recipe" loading={loading} /></div></div>)
}
