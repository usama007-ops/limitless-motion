'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getWorkoutChallenges } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'name', label: 'Challenge', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${val === 'active' ? 'bg-green-100 text-green-700' : val === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>{val}</span> },
  { key: 'start_date', label: 'Start', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
  { key: 'end_date', label: 'End', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
  { key: 'participant_count', label: 'Participants', sortable: true },
  { key: 'duration', label: 'Duration', render: (val) => val ? `${val} days` : '-' },
]

export default function AdminChallenges() {
  const router = useRouter()
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null); const [deleting, setDeleting] = useState(false)
  useEffect(() => { document.title = 'Challenges - Admin - Limitless Motion'; fetchData() }, [])
  async function fetchData() { try { const d = await getWorkoutChallenges(); setItems(d || []) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  async function handleDelete(id) { setDeleting(true); try { await adminDelete('workout_challenges', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) } catch (err) { alert(err.message) } finally { setDeleting(false) } }
  if (loading) return <div><AdminPageHeader title="Challenges" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Challenges" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>
  return (<div><AdminPageHeader title="Workout Challenges" description="Create and manage community challenges." action={<button onClick={() => router.push('/admin/challenges/new')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"><Plus className="w-4 h-4" /> New Challenge</button>} /><DataTable columns={columns} data={items} searchable onEdit={(id) => router.push(`/admin/challenges/${id}/edit`)} onDelete={(id) => setDeleteTarget(id)} /><ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Challenge" message="Are you sure?" /></div>)
}
