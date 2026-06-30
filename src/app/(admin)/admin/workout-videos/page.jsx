'use client'

import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { getWorkoutVideos } from '@/db'
import { adminDelete } from '@/lib/adminDb'

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'difficulty', label: 'Difficulty', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'platform', label: 'Platform', sortable: true },
  { key: 'duration', label: 'Duration', render: (val) => val ? `${val} min` : '-' },
]

export default function AdminWorkoutVideos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { document.title = 'Workout Videos - Admin - Limitless Motion'; fetchData() }, [])

  async function fetchData() {
    try { const d = await getWorkoutVideos(); setItems(d || []) }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleDelete(id) {
    setDeleting(true)
    try { await adminDelete('workout_videos', id); setItems((p) => p.filter((i) => i.id !== id)); setDeleteTarget(null) }
    catch (err) { alert(err.message) }
    finally { setDeleting(false) }
  }

  async function handleNewSubmit(e) {
    e.preventDefault()
    const form = e.target
    const data = {
      title: form.title.value,
      difficulty: form.difficulty.value,
      category: form.category.value,
      platform: form.platform.value,
      description: form.description.value,
    }
    if (form.duration.value) data.duration = Number(form.duration.value)
    if (form.platform.value === 'youtube' || form.platform.value === 'vimeo') {
      data.video_id = form.video_source.value
    } else {
      data.video_file_url = form.video_source.value
    }
    setSaving(true)
    try {
      const res = await fetch('/api/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table: 'workout_videos', data }) })
      if (!res.ok) throw new Error('Create failed')
      setShowNew(false)
      fetchData()
    } catch (err) { alert(err.message) }
    finally { setSaving(false) }
  }

  if (loading) return <div><AdminPageHeader title="Workout Videos" /><div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground text-sm animate-pulse">Loading...</div></div>
  if (error) return <div><AdminPageHeader title="Workout Videos" /><div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-destructive">{error}</div></div>

  return (
    <div>
      <AdminPageHeader title="Workout Videos" description="Manage workout tutorial videos." action={<button onClick={() => setShowNew(!showNew)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors"><Plus className="w-4 h-4" /> {showNew ? 'Cancel' : 'Add Video'}</button>} />

      {showNew && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6 max-w-2xl">
          <h3 className="text-sm font-semibold text-foreground mb-4">Add Workout Video</h3>
          <form onSubmit={handleNewSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-foreground mb-1">Title *</label><input name="title" required className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Difficulty *</label><select name="difficulty" required className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Category *</label><select name="category" required className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"><option value="cardio">Cardio</option><option value="strength">Strength</option><option value="flexibility">Flexibility</option><option value="yoga">Yoga</option><option value="hiit">HIIT</option><option value="pilates">Pilates</option><option value="dance">Dance</option><option value="other">Other</option></select></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Platform *</label><select name="platform" required className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"><option value="self_hosted">Self Hosted</option><option value="youtube">YouTube</option><option value="vimeo">Vimeo</option><option value="other">Other</option></select></div>
            </div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea name="description" rows={3} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Duration (min)</label><input name="duration" type="number" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Video Source</label><input name="video_source" placeholder="Enter video URL or platform ID based on platform selected" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" /></div>
            </div>
            <div className="flex gap-3 pt-2"><button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/90 rounded-md transition-colors disabled:opacity-50">{saving ? 'Saving...' : 'Save Video'}</button></div>
          </form>
        </div>
      )}

      <DataTable columns={columns} data={items} searchable searchPlaceholder="Search by title..." onDelete={(id) => setDeleteTarget(id)} />
      <ConfirmDialog open={!!deleteTarget} onConfirm={() => handleDelete(deleteTarget)} onCancel={() => setDeleteTarget(null)} loading={deleting} title="Delete Video" message="Are you sure?" />
    </div>
  )
}
