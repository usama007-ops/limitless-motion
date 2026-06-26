'use client'

import React, { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getCommunityPosts } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'author_name', label: 'Author', sortable: true },
  { key: 'type', label: 'Type', sortable: true, render: (val) => <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-muted">{val || 'general'}</span> },
  { key: 'content', label: 'Content', sortable: true, render: (val) => val ? (val.length > 80 ? val.slice(0, 80) + '...' : val) : '-' },
  { key: 'likes', label: 'Likes', sortable: true },
  { key: 'date', label: 'Date', sortable: true, render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
]

export default function AdminCommunityPosts() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null); const [deleting, setDeleting] = useState(false)
  useEffect(() => { document.title = 'Community Posts - Admin - Limitless Motion'; fetchData() }, [])
  async function fetchData() { try { const d = await getCommunityPosts(); setItems(d || []) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  async function handleDelete(id) { setDeleting(true); try { await adminDelete('community_posts', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) } catch (err) { alert(err.message) } finally { setDeleting(false) } }
  if (loading) return <div><AdminPageHeader title="Community Posts" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Community Posts" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>
  return (<div><AdminPageHeader title="Community Posts" description="Moderate user posts." /><DataTable columns={columns} data={items} searchable searchPlaceholder="Search by author or content..." onDelete={(id) => setDeleteTarget(id)} /><ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Post" message="Delete this community post?" /></div>)
}
