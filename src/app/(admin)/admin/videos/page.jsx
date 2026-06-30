'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getVideos } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'guest_name', label: 'Guest', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'platform', label: 'Platform', sortable: true, render: (val) => val ? val.replace(/_/g, ' ') : '-' },
  { key: 'view_count', label: 'Views', sortable: true },
  { key: 'upload_date', label: 'Upload Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminVideos() {
  const router = useRouter()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    document.title = 'Interviews - Admin - Limitless Motion'
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const data = await getVideos()
      setItems(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try {
      await adminDelete('videos', id)
      setItems((prev) => prev.filter((item) => item.id !== id))
      setDeleteTarget(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div><AdminPageHeader title="Interviews" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Interviews" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader
        title="Podcast Interviews"
        description="Manage video interviews and podcast episodes."
        action={
          <button onClick={() => router.push('/admin/videos/new')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors">
            <Plus className="w-4 h-4" /> Add Episode
          </button>
        }
      />
      <DataTable columns={columns} data={items} searchable searchPlaceholder="Search by title or guest..." onEdit={(id) => router.push(`/admin/videos/${id}/edit`)} onDelete={(id) => setDeleteTarget(id)} />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Episode" message="Are you sure you want to delete this interview video?" />
    </div>
  )
}
