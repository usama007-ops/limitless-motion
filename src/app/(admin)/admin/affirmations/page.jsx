'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getAffirmations } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'text', label: 'Affirmation', sortable: true, render: (val) => val ? (val.length > 80 ? val.slice(0, 80) + '...' : val) : '-' },
  { key: 'date', label: 'Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminAffirmations() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { document.title = 'Affirmations - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try { const d = await getAffirmations({ limit: 200 }); setItems(d || []) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try { await adminDelete('affirmations', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) }
    catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  if (loading) return <div><AdminPageHeader title="Affirmations" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Affirmations" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title="Daily Affirmations" description="Manage motivational quotes." action={<button onClick={() => router.push('/admin/affirmations/new')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"><Plus className="w-4 h-4" /> Add Affirmation</button>} />
      <DataTable columns={columns} data={items} searchable searchPlaceholder="Search affirmations..." onDelete={(id) => setDeleteTarget(id)} />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Affirmation" message="Are you sure?" />
    </div>
  )
}
