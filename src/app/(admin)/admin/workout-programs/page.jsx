'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getWorkoutPrograms } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'goal', label: 'Goal', sortable: true },
  { key: 'difficulty', label: 'Difficulty', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'session_duration', label: 'Duration (min)', sortable: true },
]

export default function AdminWorkoutPrograms() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { document.title = 'Workout Programs - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try { const d = await getWorkoutPrograms(); setItems(d || []) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try { await adminDelete('workout_programs', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) }
    catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  if (loading) return <div><AdminPageHeader title="Workout Programs" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Workout Programs" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title="Workout Programs" description="Create and manage workout programs." action={<button onClick={() => router.push('/admin/workout-programs/new')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"><Plus className="w-4 h-4" /> New Program</button>} />
      <DataTable columns={columns} data={items} searchable searchPlaceholder="Search programs..." onEdit={(id) => router.push(`/admin/workout-programs/${id}/edit`)} onDelete={(id) => setDeleteTarget(id)} />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Program" message="This will also remove all associated days and exercises. Are you sure?" />
    </div>
  )
}
