'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, LayoutTemplate } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import MovementBuilderCanvas from '@/components/admin/MovementBuilderCanvas'
import { getExercises } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'exercise_name', label: 'Movement', sortable: true },
  { key: 'program_name', label: 'Program', sortable: true },
  { key: 'sets', label: 'Sets', sortable: true },
  { key: 'reps', label: 'Reps', sortable: true },
]

export default function AdminExercises() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [builderOpen, setBuilderOpen] = useState(false)

  useEffect(() => { document.title = 'Movements - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try {
      const d = await getExercises()
      setItems((d || []).map(ex => ({ ...ex, program_name: ex.workout_programs?.name || '-' })))
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try { await adminDelete('exercises', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) }
    catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  if (loading) return <div><AdminPageHeader title="Movements" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Movements" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader
        title="Movements"
        description="Manage individual movements/exercises."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBuilderOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"
            >
              <LayoutTemplate className="w-4 h-4" /> Builder
            </button>
            <button
              onClick={() => router.push('/admin/exercises/new')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" /> New Movement
            </button>
          </div>
        }
      />
      <DataTable columns={columns} data={items} searchable searchPlaceholder="Search movements..." onEdit={(id) => router.push(`/admin/exercises/${id}/edit`)} onDelete={(id) => setDeleteTarget(id)} />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Movement" message="Are you sure?" />
      <MovementBuilderCanvas open={builderOpen} onClose={() => { setBuilderOpen(false); fetchData() }} />
    </div>
  )
}
