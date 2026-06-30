'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, UtensilsCrossed, Globe, Beef, Sunrise } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getMealRecipes, getEthiopianMeals, getHighProteinMeals, getFastingBreakfasts } from '@/db'
import { adminDelete } from '@/lib/adminDb'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'recipes', label: 'Standard', icon: UtensilsCrossed, table: 'meal_recipes', fetch: getMealRecipes, cols: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'season', label: 'Season', sortable: true },
    { key: 'calories_total', label: 'Calories', sortable: true },
    { key: 'protein_grams', label: 'Protein (g)', sortable: true },
    { key: 'prep_time_minutes', label: 'Prep (min)', sortable: true },
  ]},
  { id: 'ethiopian', label: 'Ethiopian', icon: Globe, table: 'ethiopian_meals', fetch: getEthiopianMeals, cols: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'season', label: 'Season', sortable: true },
    { key: 'calories_total', label: 'Calories', sortable: true },
    { key: 'protein_grams', label: 'Protein (g)', sortable: true },
    { key: 'prep_time_minutes', label: 'Prep (min)', sortable: true },
  ]},
  { id: 'high-protein', label: 'High Protein', icon: Beef, table: 'high_protein_meals', fetch: getHighProteinMeals, cols: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'protein_grams', label: 'Protein (g)', sortable: true },
    { key: 'calories_total', label: 'Calories', sortable: true },
    { key: 'prep_time_minutes', label: 'Prep (min)', sortable: true },
  ]},
  { id: 'fasting-breakfast', label: 'Fasting Breakfast', icon: Sunrise, table: 'fasting_breakfasts', fetch: getFastingBreakfasts, cols: [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'calories_total', label: 'Calories', sortable: true },
    { key: 'protein_grams', label: 'Protein (g)', sortable: true },
    { key: 'prep_time_minutes', label: 'Prep (min)', sortable: true },
    { key: 'is_featured', label: 'Featured', render: (v) => v ? 'Yes' : 'No' },
  ]},
]

export default function AdminMeals() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('recipes')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const tab = tabs.find(t => t.id === activeTab)

  useEffect(() => { document.title = 'Meals - Admin - Limitless Motion' }, [])

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null)
      try {
        const t = tabs.find(t => t.id === activeTab)
        const d = await t.fetch()
        setItems(d || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [activeTab])

  async function handleDelete(id) {
    setDeleting(true)
    try {
      await adminDelete(tab.table, id)
      setItems(p => p.filter(i => i.id !== id))
      setDeleteTarget(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  const TabIcon = tab.icon

  return (
    <div>
      <AdminPageHeader
        title="All Meals"
        description="Manage all meal types from one place."
        action={
          <button
            onClick={() => router.push(`/admin/${tab.table === 'meal_recipes' ? 'meal-recipes' : tab.table === 'ethiopian_meals' ? 'ethiopian-meals' : tab.table === 'high_protein_meals' ? 'high-protein-meals' : 'fasting-breakfasts'}/new`)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" /> New {tab.label}
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-muted/50 p-1 rounded-lg w-fit">
        {tabs.map(t => {
          const TIcon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all',
                activeTab === t.id
                  ? 'bg-card text-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TIcon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div>
      ) : (
        <DataTable
          columns={tab.cols}
          data={items}
          searchable
          onEdit={(id) => router.push(`/admin/${tab.table === 'meal_recipes' ? 'meal-recipes' : tab.table === 'ethiopian_meals' ? 'ethiopian-meals' : tab.table === 'high_protein_meals' ? 'high-protein-meals' : 'fasting-breakfasts'}/${id}/edit`)}
          onDelete={(id) => setDeleteTarget(id)}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        title="Delete Meal"
        message="Are you sure you want to delete this item?"
      />
    </div>
  )
}
