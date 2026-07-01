'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminForm from '@/components/admin/AdminForm'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getCommunityPosts } from '@/db'
import { adminCreate, adminDelete } from '@/lib/adminDb'
import { useAuth } from '@/contexts/AuthContext.jsx'

const formFields = [
  { name: 'type', label: 'Type', type: 'select', options: ['success story', 'progress update', 'motivation', 'workout win'], required: true },
  { name: 'content', label: 'Content', type: 'textarea', rows: 3, required: true },
  { name: 'author_name', label: 'Author Name', type: 'text' },
  { name: 'image_url', label: 'Image URL', type: 'text', placeholder: 'https://...' },
]

const columns = [
  { key: 'author_name', label: 'Author', sortable: true },
  { key: 'type', label: 'Type', sortable: true, render: (val) => <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-muted">{val || 'general'}</span> },
  {
    key: 'content', label: 'Content', sortable: true,
    render: (val) => val ? (val.length > 80 ? val.slice(0, 80) + '...' : val) : '-',
  },
  { key: 'likes', label: 'Likes', sortable: true },
  { key: 'comments', label: 'Comments', render: (val) => Array.isArray(val) ? val.length : 0 },
  { key: 'date', label: 'Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminCommunityPosts() {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { document.title = 'Community Posts - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try { const d = await getCommunityPosts(); setItems(d || []) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleCreate(data) {
    setCreating(true)
    try {
      const payload = { author_id: currentUser?.id }
      formFields.forEach((f) => {
        const v = data[f.name]
        if (v !== '' && v != null) payload[f.name] = f.type === 'number' ? Number(v) : v
      })
      await adminCreate('community_posts', payload)
      setShowForm(false)
      await fetchData()
    } catch (err) { alert(err.message) }
    finally { setCreating(false) }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try {
      await adminDelete('community_posts', id)
      setItems((p) => p.filter((i) => i.id !== id))
      setDeleteTarget(null)
    } catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  if (loading) return <div><AdminPageHeader title="Community Posts" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Community Posts" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader
        title="Community Posts"
        description="Moderate user posts and create new ones."
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {showForm ? 'Cancel' : 'New Post'}
          </button>
        }
      />

      {showForm && (
        <div className="mb-8 bg-card border border-border rounded-lg p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">Create a Post</h2>
          <AdminForm fields={formFields} onSubmit={handleCreate} submitLabel="Create Post" loading={creating} />
        </div>
      )}

      <DataTable
        columns={columns}
        data={items}
        searchable
        searchPlaceholder="Search by author or content..."
        onEdit={(id) => router.push(`/admin/community-posts/${id}`)}
        onDelete={(id) => setDeleteTarget(id)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
        title="Delete Post"
        message="Delete this community post?"
      />
    </div>
  )
}
