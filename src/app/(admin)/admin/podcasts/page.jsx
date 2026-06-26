'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getPodcasts } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'platform', label: 'Platform', sortable: true },
  { key: 'speaker_name', label: 'Speaker', sortable: true },
  { key: 'duration', label: 'Duration', render: (val) => val ? `${val} min` : '-' },
  { key: 'created_at', label: 'Added', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminPodcasts() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { document.title = 'Podcasts - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try { const d = await getPodcasts(); setItems(d || []) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try { await adminDelete('podcasts', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) }
    catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  if (loading) return <div><AdminPageHeader title="Podcasts" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Podcasts" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title="External Podcasts" description="Manage links to Spotify, Apple Podcasts, etc." action={<button onClick={() => router.push('/admin/podcasts/new')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"><Plus className="w-4 h-4" /> Add Podcast</button>} />
      <DataTable columns={columns} data={items} searchable searchPlaceholder="Search by name or speaker..." onEdit={(id) => router.push(`/admin/podcasts/${id}/edit`)} onDelete={(id) => setDeleteTarget(id)} />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Podcast" message="Are you sure?" />
    </div>
  )
}
