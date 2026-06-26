'use client'

import React, { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import { adminDelete, adminUpdate } from '@/lib/adminDb'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'session_length', label: 'Session', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (val) => {
    const colors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700' }
    return <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${colors[val] || 'bg-muted text-muted-foreground'}`}>{val}</span>
  }},
  { key: 'created_at', label: 'Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminBookings() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null); const [deleting, setDeleting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(null)

  useEffect(() => { document.title = 'Bookings - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try {
      const supabase = (await import('@/lib/supabaseClient')).createClient()
      const { data } = await supabase.from('coaching_bookings').select('*').order('created_at', { ascending: false })
      setItems(data || [])
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(id) { setDeleting(true); try { await adminDelete('coaching_bookings', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) } catch (err) { alert(err.message) } finally { setDeleting(false) } }

  async function updateStatus(id, status) {
    setStatusUpdating(id)
    try {
      await adminUpdate('coaching_bookings', id, { status })
      setItems((p) => p.map((i) => i.id === id ? { ...i, status } : i))
    } catch (err) { alert(err.message) }
    finally { setStatusUpdating(null) }
  }

  if (loading) return <div><AdminPageHeader title="Bookings" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Bookings" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title="Coaching Bookings" description="View and manage coaching session bookings." />
      <DataTable
        columns={[
          ...columns,
          { key: 'goals', label: 'Goals', render: (val) => val ? (val.length > 40 ? val.slice(0, 40) + '...' : val) : '-' },
          { key: '_actions', label: 'Actions', render: (_val, row) => (
            <div className="flex gap-1">
              {row.status === 'pending' && <button onClick={() => updateStatus(row.id, 'confirmed')} disabled={statusUpdating === row.id} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50">Confirm</button>}
              {row.status === 'confirmed' && <button onClick={() => updateStatus(row.id, 'completed')} disabled={statusUpdating === row.id} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50">Complete</button>}
            </div>
          )},
        ]}
        data={items}
        searchable
        searchPlaceholder="Search by name or email..."
        onDelete={(id) => setDeleteTarget(id)}
      />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Booking" message="Are you sure?" />
    </div>
  )
}
